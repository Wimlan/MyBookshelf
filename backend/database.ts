import dotenv from "dotenv";
import { Client, Pool } from "pg";
dotenv.config();

export const database = new Client({
  connectionString: process.env.PGURI,
});
database.connect();

export const pool = new Pool({ connectionString: process.env.PGURI });
