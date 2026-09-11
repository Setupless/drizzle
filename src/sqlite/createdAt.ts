import { sql } from "drizzle-orm";
import { text } from "drizzle-orm/sqlite-core";

/**
 * Defines non-null `text` column `created_at`.
 *
 * The database uses `current_timestamp` when a value is omitted on insert.
 * Values are UTC strings in `YYYY-MM-DD HH:MM:SS` format, with second
 * precision.
 *
 * @returns An object containing `createdAt` to spread into a `sqliteTable`
 * definition.
 */
export default function createdAt() {
  return {
    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  };
}
