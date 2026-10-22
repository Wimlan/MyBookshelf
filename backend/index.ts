import express from "express";
import path from "path";
import { pool } from "./database.ts";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
// import cors from "cors";
import { createUserRouter } from "./user.ts";
import { createGoogleIdTokenVerifier } from "./googleAuth.ts";
import books from "./books.ts";

const app = express();
const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const appOrigin = process.env.APP_ORIGIN?.trim();
const sessionSecret = process.env.SESSION_SECRET;
const isMissingConfig = !googleClientId || !appOrigin || !sessionSecret;
if (isMissingConfig) {
  throw new Error(
    "Set GOOGLE_CLIENT_ID, APP_ORIGIN, and SESSION_SECRET in the backend environment.",
  );
}
if (new URL(appOrigin).origin !== appOrigin) {
  throw new Error(
    "APP_ORIGIN must be an exact origin without a path or trailing slash.",
  );
}
const isProduction = process.env.NODE_ENV === "production";
if (isProduction) app.set("trust proxy", 1);

const PgSession = connectPgSimple(session);

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   }),
// );
app.use(express.json());
app.use(
  session({
    store: new PgSession({ pool, createTableIfMissing: true }),
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: isProduction, httpOnly: true, sameSite: "lax" },
  }),
);

app.use(
  "/api/user",
  createUserRouter({
    pool,
    verifyIdToken: createGoogleIdTokenVerifier(googleClientId),
    appOrigin,
  }),
);
app.use("/api/books", books);
app.use("/api", (_req, res) => {
  res.status(404).json({ message: "API endpoint not found." });
});
app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (res.headersSent) {
      next(error);
      return;
    }
    const isInvalidJson =
      error instanceof SyntaxError && "status" in error && error.status === 400;
    if (isInvalidJson) {
      res.status(400).json({ message: "Request body must be valid JSON." });
      return;
    }
    console.error(
      "API request failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    res.status(500).json({ message: "Server error. Please try again." });
  },
);

// app.get("/api", async (_request, response) => {
//   const { rows } = await database.query(
//     "SELECT * FROM books WHERE id = $1",
//     [2],
//   );

//   response.send(rows);
// });

app.use(express.static(path.join(path.resolve(), "dist")));

app.listen(3000, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.");
});
