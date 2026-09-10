import { sql } from "drizzle-orm";
import { datetime } from "drizzle-orm/mysql-core";

/**
 * Defines a non-null `updatedAt` DATETIME(3) column. The database supplies the
 * insert default, and Drizzle supplies UTC values for updates it executes.
 * Requires MySQL 8.0.13+ for the UTC expression default.
 */
export default function updatedAt() {
  return {
    updatedAt: datetime("updated_at", { mode: "date", fsp: 3 })
      .notNull()
      .default(sql`(utc_timestamp(3))`)
      .$onUpdate(() => sql`utc_timestamp(3)`),
  };
}
