import { Pool } from "pg";
import { logger } from "./logger";

let pool: Pool | null = null;

export function getPool(): Pool | null {
  if (!process.env["DATABASE_URL"]) return null;
  if (!pool) {
    const ssl = process.env["NODE_ENV"] === "production"
      ? { rejectUnauthorized: true }
      : true;
    pool = new Pool({ connectionString: process.env["DATABASE_URL"], ssl });
    pool.on("error", (err) => {
      logger.error({ err }, "Unexpected database pool error");
    });
  }
  return pool;
}
