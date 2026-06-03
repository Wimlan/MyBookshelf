import express from "express";
import type { QueryResult } from "pg";
import { database } from "./database.ts";
import * as argon2 from "argon2";
import { isAuthenticated } from "./middleware/isAuthenticated.ts";

const router = express.Router();

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

//check if user is logged in and sends username for frontend check
router.get("/session", async (req, res) => {
  if (!req.session.user) {
    res.status(401).json({ message: "Not logged in" });
    return;
  }

  const { rows } = await database.query(
    "SELECT username FROM Users WHERE id = $1",
    [req.session.user],
  );

  res.json({ userName: rows[0].username });
});

//signin
router.post("/signin", async (req, res, next) => {
  const inputEmail: User["email"] = req.body.email;
  const inputPassword: User["password"] = req.body.password;

  const result: QueryResult<User> = await database.query(
    "SELECT * FROM Users where email = $1",
    [inputEmail],
  );
  const user = result.rows[0];
  if (!user) {
    res.status(409).send({ message: "User not found." });
    return;
  }

  try {
    if (await argon2.verify(user.password, inputPassword)) {
      req.session.regenerate(function (err) {
        if (err) next(err);

        // store user information in session
        req.session.user = user.id;

        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save(function (err) {
          if (err) return next(err);
          res.send({ message: "Log in successful.", userName: user.username });
        });
      });
    } else {
      res.status(400).send({ message: "Password did not match." });
      return;
    }
  } catch (err) {
    res.status(500).send("Unable to find user.");
  }
});

//sign out
router.get("/signout", function (req, res, next) {
  // clear the user from the session object and save.
  req.session.user = null;
  req.session.save(function (err) {
    if (err) next(err);

    req.session.regenerate(function (err) {
      if (err) next(err);
      res.send("You are logged out.");
    });
  });
});

//Create User
router.post("/signup", async (req, res) => {
  const newUser: User = req.body;
  const missing = !newUser.username || !newUser.password || !newUser.email;
  const invalid =
    newUser.username.length < 3 ||
    newUser.password.length < 8 ||
    !newUser.email.includes("@");

  if (missing) {
    res.status(400).send({ message: "All fields are required." });
    return;
  }
  if (invalid) {
    res.status(400).send({ message: "Invalid input." });
    return;
  }

  //Get username and email and check if already exists
  const username = await database.query(
    "SELECT username FROM Users where username = $1",
    [newUser.username],
  );

  const email = await database.query(
    "SELECT email FROM Users where email = $1",
    [newUser.email],
  );

  //If already exists, stop signup and return 409
  if (username.rows.length > 0) {
    res.status(409).send({ message: "Username already exists." });
    return;
  } else if (email.rows.length > 0) {
    res.status(409).send({ message: "E-mail already exists." });
    return;
  } else {
    //If username, email doesnt exist hash password with Argon2 and add User to database
    try {
      const hashedPassword = await argon2.hash(newUser.password);
      await database.query(
        "INSERT INTO Users(username, email, password) VALUES ($1, $2, $3);",
        [newUser.username, newUser.email, hashedPassword],
      );
      res.status(201).send({ message: "User created." });
    } catch {
      res.status(500).send("Server error.");
    }
  }
});

//Delete User
router.delete("/delete/", async (req, res) => {
  const id = req.session.user;
  const password: string = req.body.password;

  const result = await database.query(
    "SELECT password FROM Users where id = $1",
    [id],
  );
  const user = result.rows[0];
  if (!user) {
    res.status(404).json({ message: "User not found." });
    return;
  }

  try {
    if (await argon2.verify(user.password, password)) {
      await database.query("DELETE FROM Users WHERE id = $1", [id]);

      req.session.user = null;
      req.session.save(function (err) {
        if (err)
          return res.status(500).json({ message: "Unable to delete user." });

        req.session.regenerate(function (err) {
          if (err)
            return res.status(500).json({ message: "Unable to delete user." });

          res.status(200).json({ message: "User Deleted" });
        });
      });
    } else {
      res.status(400).json({ message: "You've entered the wrong password." });
      return;
    }
  } catch (err) {
    res.status(500).json({ message: "Unable to delete user." });
  }
});

export default router;
