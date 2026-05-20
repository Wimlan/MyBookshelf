import express from "express";
import { database } from "./database.ts";
import type { QueryResult } from "pg";
import session from "express-session";
import user from "./user.ts";

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    },
  }),
);
app.use(express.json());
app.use("/user", user);

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
