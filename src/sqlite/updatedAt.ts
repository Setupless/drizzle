import { sql } from "drizzle-orm";
import { text } from "drizzle-orm/sqlite-core";

/**
 * Defines non-null `text` column `updated_at`.
 *
 * The database uses `current_timestamp` when a value is omitted on insert.
 * When `updatedAt` is omitted from a Drizzle update, Drizzle uses
 * `current_timestamp`.
 * Explicit values take precedence. Updates outside Drizzle do not set it
 * automatically.
 * Values are UTC strings in `YYYY-MM-DD HH:MM:SS` format, with second
 * precision.
 *
 * @returns An object containing `updatedAt` to spread into a `sqliteTable`
 * definition.
 */
export default function updatedAt() {
  return {
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(current_timestamp)`)
      .$onUpdate(() => sql`(current_timestamp)`),
  };
}
