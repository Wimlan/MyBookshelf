import dotenv from "dotenv";
import { Client } from "pg";
dotenv.config();

export const database = new Client({
  connectionString: process.env.PGURI,
});

database.connect();
