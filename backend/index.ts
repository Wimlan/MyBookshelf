import express from "express";
import { database, pool } from "./database.ts";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import user from "./user.ts";
import books from "./books.ts";
import bookshelf from "./bookshelf.ts";

const app = express();

const PgSession = connectPgSimple(session);
new PgSession({ pool, createTableIfMissing: true });

app.use(express.json());
app.use(
  session({
    store: new PgSession({ pool, createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);
app.use("/user", user);
app.use("/books", books);
app.use("/bookshelf", bookshelf);

app.get("/api", async (_request, response) => {
  const { rows } = await database.query(
    "SELECT * FROM books WHERE id = $1",
    [2],
  );

  response.send(rows);
});

app.listen(3000, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.");
});
