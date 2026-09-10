import { sql } from "drizzle-orm";
import { datetime } from "drizzle-orm/mysql-core";

/**
 * Defines a non-null `createdAt` DATETIME(3) column with a database default of
 * `utc_timestamp(3)`, independent of the session timezone. Requires MySQL 8.0.13+.
 */
export default function createdAt() {
  return {
    createdAt: datetime("created_at", { mode: "date", fsp: 3 })
      .notNull()
      .default(sql`(utc_timestamp(3))`),
  };
}
