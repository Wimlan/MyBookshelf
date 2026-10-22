import express from "express";
import type { Pool } from "pg";
import type { VerifyGoogleIdToken } from "./googleAuth.ts";

interface User {
  id: string;
  username: string;
}

interface Options {
  pool: Pool;
  verifyIdToken: VerifyGoogleIdToken;
  appOrigin: string;
}

function isGoogleIdToken(value: unknown): value is string {
  const isValid =
    typeof value === "string" && value.length > 0 && value.length <= 10000;
  return isValid;
}

async function regenerateSession(req: express.Request) {
  await new Promise<void>((resolve, reject) => {
    req.session.regenerate((error) => (error ? reject(error) : resolve()));
  });
}

async function saveSession(req: express.Request) {
  await new Promise<void>((resolve, reject) => {
    req.session.save((error) => (error ? reject(error) : resolve()));
  });
}

async function login(req: express.Request, res: express.Response, user: User) {
  await regenerateSession(req);
  req.session.user = user.id;
  await saveSession(req);
  res.json({ userName: user.username });
}

export function createUserRouter({ pool, verifyIdToken, appOrigin }: Options) {
  const router = express.Router();

  router.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    const isMutation = req.method === "POST" || req.method === "DELETE";
    const isUntrustedRequest = isMutation && req.get("origin") !== appOrigin;
    if (isUntrustedRequest) {
      res.status(403).json({ message: "Request origin is not allowed." });
      return;
    }
    next();
  });

  router.get("/session", async (req, res) => {
    if (!req.session.user) {
      res.status(401).json({ message: "Not logged in" });
      return;
    }
    const { rows } = await pool.query<User>(
      "SELECT id, username FROM Users WHERE id = $1",
      [req.session.user],
    );
    const user = rows[0];
    if (!user) {
      res.status(401).json({ message: "Your account no longer exists." });
      return;
    }
    res.json({ userName: user.username });
  });

  router.post("/google", async (req, res) => {
    const idToken: unknown = req.body?.idToken;
    if (!isGoogleIdToken(idToken)) {
      res.status(400).json({ message: "A Google ID token is required." });
      return;
    }
    const identity = await verifyIdToken(idToken);
    if (!identity) {
      res.status(401).json({
        message: "Google sign-in could not be verified. Please try again.",
      });
      return;
    }

    const { rows } = await pool.query<User>(
      "SELECT id, username FROM Users WHERE google_sub = $1",
      [identity.sub],
    );
    const user = rows[0];
    if (user) {
      await login(req, res, user);
      return;
    }

    await regenerateSession(req);
    req.session.pendingGoogle = {
      sub: identity.sub,
      email: identity.email,
      expiresAt: Math.min(identity.expiresAt, Date.now() + 10 * 60 * 1000),
    };
    await saveSession(req);
    res.json({ requiresUsername: true });
  });

  router.get("/google/signup", (req, res) => {
    const pending = req.session.pendingGoogle;
    const isPendingSignup =
      pending !== undefined && pending.expiresAt > Date.now();
    if (!isPendingSignup) {
      res
        .status(401)
        .json({ message: "Sign in with Google again to choose a username." });
      return;
    }
    res.json({ requiresUsername: true });
  });

  router.post("/google/signup", async (req, res) => {
    const pending = req.session.pendingGoogle;
    const isPendingSignup =
      pending !== undefined && pending.expiresAt > Date.now();
    if (!isPendingSignup) {
      res.status(401).json({
        message: "Your signup has expired. Sign in with Google again.",
      });
      return;
    }
    const username: unknown = req.body?.username;
    const isValidUsername =
      typeof username === "string" && /^[A-Za-z0-9_-]{3,30}$/.test(username);
    if (!isValidUsername) {
      res.status(400).json({
        message:
          "Use 3-30 letters, numbers, underscores, or hyphens for your username.",
      });
      return;
    }

    const { rows } = await pool.query<User>(
      `INSERT INTO Users (username, email, google_sub)
       VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING id, username`,
      [username, pending.email, pending.sub],
    );
    let user = rows[0];
    if (!user) {
      const existing = await pool.query<User>(
        "SELECT id, username FROM Users WHERE google_sub = $1",
        [pending.sub],
      );
      user = existing.rows[0];
    }
    if (!user) {
      const existing = await pool.query(
        "SELECT id FROM Users WHERE username = $1",
        [username],
      );
      const message = existing.rowCount
        ? "Username already exists. Please choose another."
        : "This email is already registered. Automatic account linking is disabled.";
      res.status(409).json({ message });
      return;
    }
    await login(req, res, user);
  });

  router.post("/signout", async (req, res) => {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((error) => (error ? reject(error) : resolve()));
    });
    res.clearCookie("connect.sid", { path: "/" });
    res.json({ message: "You are logged out." });
  });

  router.delete("/delete", async (req, res) => {
    if (!req.session.user) {
      res
        .status(401)
        .json({ message: "Sign in before deleting your account." });
      return;
    }
    const idToken: unknown = req.body?.idToken;
    if (!isGoogleIdToken(idToken)) {
      res.status(400).json({
        message: "Confirm your Google identity to delete your account.",
      });
      return;
    }
    const identity = await verifyIdToken(idToken);
    if (!identity) {
      res.status(401).json({
        message: "Google identity confirmation failed. Please try again.",
      });
      return;
    }
    const isRecentConfirmation =
      Date.now() - identity.issuedAt <= 5 * 60 * 1000;
    if (!isRecentConfirmation) {
      res.status(401).json({
        message: "Please confirm your Google identity again before deleting.",
      });
      return;
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const { rows } = await client.query(
        "SELECT id FROM Users WHERE id = $1 AND google_sub = $2 FOR UPDATE",
        [req.session.user, identity.sub],
      );
      if (!rows[0]) {
        await client.query("ROLLBACK");
        res.status(403).json({
          message: "Use the Google account associated with this bookshelf.",
        });
        return;
      }
      await client.query(
        `DELETE FROM Bookshelves_Tags WHERE bookshelf_id IN
         (SELECT id FROM Bookshelves WHERE user_id = $1)`,
        [req.session.user],
      );
      await client.query("DELETE FROM Bookshelves WHERE user_id = $1", [
        req.session.user,
      ]);
      await client.query("DELETE FROM Users WHERE id = $1", [req.session.user]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((error) => (error ? reject(error) : resolve()));
    });
    res.clearCookie("connect.sid", { path: "/" });
    res.json({ message: "User deleted." });
  });

  return router;
}
