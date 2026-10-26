import express from "express";
import { database } from "../database.ts";

export async function isAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const userId = req.session.user;
  if (!userId) {
    res.status(403).send("Unauthorized");
    return;
  }

  const { rows } = await database.query<{ is_admin: boolean }>(
    "SELECT is_admin FROM Users WHERE id = $1",
    [userId],
  );
  if (rows[0]?.is_admin !== true) {
    res.status(403).send("Unauthorized");
    return;
  }

  next();
}
