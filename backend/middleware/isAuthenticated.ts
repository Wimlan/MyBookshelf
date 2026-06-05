import express from "express";

// middleware to test if authenticated
export function isAuthenticated(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  if (!req.session.user) {
    res.status(403).send("Unauthorized");
    return;
  }

  next();
}
