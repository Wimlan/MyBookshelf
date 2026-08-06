import express from "express";
import path from "path";
import { database, pool } from "./database.ts";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
// import cors from "cors";
import user from "./user.ts";
import books from "./books.ts";

const app = express();

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
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: "lax" },
  }),
);

app.use("/api/user", user);
app.use("/api/books", books);

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
