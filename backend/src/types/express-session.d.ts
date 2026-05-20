declare module "express-session" {
  interface SessionData {
    user: number | null;
  }
}

export {};
