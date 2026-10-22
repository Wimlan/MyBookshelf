import dotenv from "dotenv";
import { Pool } from "pg";
dotenv.config();

if (!process.env.PGURI) {
  throw new Error("Missing PGURI in the backend environment.");
}

export const pool = new Pool({
  connectionString: process.env.PGURI,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  keepAlive: true,
});

pool.on("error", (error) => {
  console.error("Idle PostgreSQL connection failed:", error.message);
});

export const database = pool;
