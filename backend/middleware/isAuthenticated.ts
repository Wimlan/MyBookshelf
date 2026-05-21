import express from "express";

// middleware to test if authenticated
export function isAuthenticated(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const id = Number(req.params.id);
  const sessionUser = Number(req.session.user);

  if (sessionUser !== id) {
    res.status(403).send("Unauthorized");
    return;
  }

  next();
}
