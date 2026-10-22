import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";
import type { TestContext } from "node:test";
import express from "express";
import session from "express-session";
import { Pool } from "pg";
import { createUserRouter } from "./user.ts";
import type { GoogleIdentity } from "./googleAuth.ts";

interface TestUser {
  id: string;
  username: string;
}

async function setup(t: TestContext) {
  const responses: (TestUser[] | Error)[] = [];
  const queries: string[] = [];
  let released = false;
  const pool = new Pool();
  const runQuery = async (sql: string) => {
    queries.push(sql);
    const response = responses.shift();
    if (response instanceof Error) throw response;
    if (!response) throw new Error(`Unexpected database query: ${sql}`);
    return { rows: response, rowCount: response.length };
  };
  const query = t.mock.method(pool, "query", runQuery);
  t.mock.method(pool, "connect", async () => ({
    query: runQuery,
    release: () => {
      released = true;
    },
  }));
  const identity: GoogleIdentity = {
    sub: "google-subject",
    email: "test@example.com",
    issuedAt: Date.now(),
    expiresAt: Date.now() + 3600000,
  };
  async function verifyIdToken(idToken: string) {
    if (idToken === "valid") return identity;
    if (idToken === "different") return { ...identity, sub: "other-subject" };
    if (idToken === "stale")
      return { ...identity, issuedAt: Date.now() - 360000 };
    if (idToken === "expired")
      return { ...identity, expiresAt: Date.now() - 1 };
    if (idToken === "service-error") throw new Error("Google unavailable");
    return null;
  }
  const app = express();
  app.use(express.json());
  app.use(
    session({
      secret: "test-session-secret",
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(
    "/api/user",
    createUserRouter({
      pool,
      verifyIdToken,
      appOrigin: "http://localhost:5173",
    }),
  );
  app.use(
    (
      _error: unknown,
      _req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (res.headersSent) {
        next(_error);
        return;
      }
      res.status(500).json({ message: "Server error" });
    },
  );
  const server = createServer(app);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(async () => {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
    await pool.end();
    assert.equal(
      responses.length,
      0,
      "Some queued database responses were not used",
    );
  });
  const address = server.address();
  const isTcpAddress = address !== null && typeof address !== "string";
  if (!isTcpAddress) throw new Error("Expected a TCP address");
  const port = address.port;
  let cookie = "";
  async function request(
    path: string,
    body?: unknown,
    method = body === undefined ? "GET" : "POST",
    origin = "http://localhost:5173",
  ) {
    const headers = {
      "Content-Type": "application/json",
      Origin: origin,
      Cookie: cookie,
      Connection: "close",
    };
    const options: RequestInit = { method, headers };
    if (body !== undefined) options.body = JSON.stringify(body);
    const response = await fetch(
      `http://127.0.0.1:${port}/api/user${path}`,
      options,
    );
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) cookie = setCookie.split(";")[0] ?? "";
    return response;
  }
  return {
    request,
    queries,
    query,
    respondWith: (...results: (TestUser[] | Error)[]) =>
      responses.push(...results),
    cookie: () => cookie,
    released: () => released,
  };
}

const existingUser: TestUser = {
  id: "1",
  username: "reader",
};

test("new Google users choose a username before receiving an authenticated session", async (t) => {
  const context = await setup(t);
  assert.equal(
    (await context.request("/google/signup", { username: "reader" })).status,
    401,
  );
  context.respondWith([]);
  const response = await context.request("/google", { idToken: "valid" });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { requiresUsername: true });
  const pendingCookie = context.cookie();
  assert.equal((await context.request("/session")).status, 401);
  assert.equal((await context.request("/google/signup")).status, 200);
  assert.equal(
    (await context.request("/google/signup", { username: "a" })).status,
    400,
  );
  const newUser = { id: "2", username: "book_reader" };
  context.respondWith([newUser]);
  const signup = await context.request("/google/signup", {
    username: "book_reader",
  });
  assert.equal(signup.status, 200);
  assert.deepEqual(await signup.json(), { userName: "book_reader" });
  assert.notEqual(context.cookie(), pendingCookie);
  assert.deepEqual(context.query.mock.calls[1]?.arguments[1], [
    "book_reader",
    "test@example.com",
    "google-subject",
  ]);
  context.respondWith([newUser]);
  assert.deepEqual(await (await context.request("/session")).json(), {
    userName: "book_reader",
  });
  assert.equal((await context.request("/google/signup")).status, 401);
});

test("returning Google users sign in by subject and signout destroys the app session", async (t) => {
  const context = await setup(t);
  context.respondWith([existingUser], [existingUser]);
  const response = await context.request("/google", { idToken: "valid" });
  assert.deepEqual(await response.json(), { userName: "reader" });
  assert.deepEqual(context.query.mock.calls[0]?.arguments[1], [
    "google-subject",
  ]);
  assert.equal((await context.request("/session")).status, 200);
  assert.equal((await context.request("/signout", {})).status, 200);
  assert.equal((await context.request("/session")).status, 401);
});

test("untrusted origins, malformed ID tokens, and invalid Google tokens cannot authenticate", async (t) => {
  const context = await setup(t);
  assert.equal(
    (
      await context.request(
        "/google",
        { idToken: "valid" },
        "POST",
        "https://evil.example",
      )
    ).status,
    403,
  );
  for (const idToken of [undefined, null, 42, {}, "", "x".repeat(10001)]) {
    assert.equal((await context.request("/google", { idToken })).status, 400);
  }
  assert.equal(
    (await context.request("/google", { idToken: "invalid" })).status,
    401,
  );
  assert.equal(
    (await context.request("/google", { idToken: "service-error" })).status,
    500,
  );
  assert.equal((await context.request("/session")).status, 401);
  assert.deepEqual(context.queries, []);
});

test("duplicate usernames preserve pending signup so another username can be chosen", async (t) => {
  const context = await setup(t);
  context.respondWith([]);
  await context.request("/google", { idToken: "valid" });
  // Insert conflict, no account for this Google identity, username taken.
  context.respondWith([], [], [existingUser]);
  const duplicate = await context.request("/google/signup", {
    username: "reader",
  });
  assert.equal(duplicate.status, 409);
  assert.equal((await context.request("/session")).status, 401);
  context.respondWith([{ id: "2", username: "new_reader" }]);
  assert.equal(
    (await context.request("/google/signup", { username: "new_reader" }))
      .status,
    200,
  );
});

test("email matches never automatically link a different Google subject", async (t) => {
  const context = await setup(t);
  // No matching Google account; insert conflicts without a username match.
  context.respondWith([], [], [], []);
  await context.request("/google", { idToken: "valid" });
  const response = await context.request("/google/signup", {
    username: "new_reader",
  });
  assert.equal(response.status, 409);
  assert.equal((await context.request("/session")).status, 401);
});

test("expired pending signup cannot create an account", async (t) => {
  const context = await setup(t);
  context.respondWith([]);
  await context.request("/google", { idToken: "expired" });
  assert.equal((await context.request("/google/signup")).status, 401);
  assert.equal(
    (await context.request("/google/signup", { username: "reader" })).status,
    401,
  );
});

test("deletion requires a session and recent confirmation of the same Google subject", async (t) => {
  const context = await setup(t);
  context.respondWith([existingUser]);
  assert.equal(
    (await context.request("/delete", { idToken: "valid" }, "DELETE")).status,
    401,
  );
  await context.request("/google", { idToken: "valid" });
  assert.equal((await context.request("/delete", {}, "DELETE")).status, 400);
  assert.equal(
    (await context.request("/delete", { idToken: "invalid" }, "DELETE")).status,
    401,
  );
  assert.equal(
    (await context.request("/delete", { idToken: "stale" }, "DELETE")).status,
    401,
  );
  // BEGIN, unmatched Google account, ROLLBACK.
  context.respondWith([], [], []);
  assert.equal(
    (await context.request("/delete", { idToken: "different" }, "DELETE"))
      .status,
    403,
  );
  // BEGIN, matching account, three deletes, COMMIT.
  context.respondWith([], [existingUser], [], [], [], []);
  assert.equal(
    (await context.request("/delete", { idToken: "valid" }, "DELETE")).status,
    200,
  );
  assert.equal((await context.request("/session")).status, 401);
  assert.ok(
    context.queries.some((sql) => sql.includes("DELETE FROM Bookshelves_Tags")),
  );
  assert.ok(
    context.queries.some((sql) =>
      sql.startsWith("DELETE FROM Bookshelves WHERE"),
    ),
  );
  assert.ok(context.queries.some((sql) => sql.startsWith("DELETE FROM Users")));
  assert.ok(context.queries.includes("COMMIT"));
  assert.ok(context.released());
});

test("deletion failures request rollback and keep the session authenticated", async (t) => {
  const context = await setup(t);
  context.respondWith([existingUser]);
  await context.request("/google", { idToken: "valid" });
  // BEGIN, account lookup, two deletes, failed user delete, ROLLBACK.
  context.respondWith(
    [],
    [existingUser],
    [],
    [],
    new Error("Simulated deletion failure"),
    [],
  );
  assert.equal(
    (await context.request("/delete", { idToken: "valid" }, "DELETE")).status,
    500,
  );
  assert.ok(context.queries.includes("ROLLBACK"));
  assert.ok(!context.queries.includes("COMMIT"));
  context.respondWith([existingUser]);
  assert.equal((await context.request("/session")).status, 200);
  assert.ok(context.released());
});
