declare module "express-session" {
  interface SessionData {
    user: string | null;
    pendingGoogle?: {
      sub: string;
      email: string;
      expiresAt: number;
    };
  }
}

export {};
