import express from "express";
import { database } from "./database.ts";
import { isAuthenticated } from "./middleware/isAuthenticated.ts";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from /books!");
});

export default router;
