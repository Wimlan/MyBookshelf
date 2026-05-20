import express from "express";
import { database } from "./database.ts";
import * as argon2 from "argon2";

const router = express.Router();

interface User {
  username: string;
  email: string;
  password: string;
}

router.post("/signup", async (req, res) => {
  const newUser: User = req.body;

  const userName = await database.query(
    "SELECT username FROM Users where username = $1",
    [newUser.username],
  );

  const eMail = await database.query(
    "SELECT email FROM Users where email = $1",
    [newUser.email],
  );

  if (userName.rows.length > 0) {
    res.status(409).send("Username already exists.");
    return;
  } else if (eMail.rows.length > 0) {
    res.status(409).send("E-mail already exists.");
    return;
  } else {
    try {
      const hashedPassword = await argon2.hash(newUser.password);
      await database.query(
        "INSERT INTO Users(username, email, password) VALUES ($1, $2, $3);",
        [newUser.username, newUser.email, hashedPassword],
      );
      res.status(201).send("User created.");
    } catch {
      res.status(500).send("Server error.");
    }
  }
});

router.delete("/:id", async (req, res) => {
  //Verifiera att användaren är inloggad först!

  const id = Number(req.params.id);
  const password: string = req.body.password;

  const result = await database.query(
    "SELECT password FROM Users where id = $1",
    [id],
  );
  const user = result.rows[0];
  if (!user) {
    res.status(404).send("User not found.");
    return;
  }

  try {
    if (await argon2.verify(user.password, password)) {
      await database.query("DELETE FROM Users WHERE id = $1", [id]);
      res.status(200).send("User deleted.");
    } else {
      res.status(400).send("Password did not match.");
      return;
    }
  } catch (err) {
    res.status(500).send("Unable to delete user.");
  }
});

router.get("/", (req, res) => {
  res.send("Hello from /user!");
});

export default router;
