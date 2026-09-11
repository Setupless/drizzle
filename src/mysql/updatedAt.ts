import { sql } from "drizzle-orm";
import { datetime } from "drizzle-orm/mysql-core";

/**
 * Defines non-null `datetime(3)` column `updated_at`.
 *
 * The database uses `utc_timestamp(3)` when a value is omitted on insert.
 * When `updatedAt` is omitted from a Drizzle update, Drizzle uses
 * `utc_timestamp(3)`.
 * Explicit values take precedence. Updates outside Drizzle do not set it
 * automatically.
 * Values use UTC with millisecond precision, independent of the session
 * timezone.
 * Drizzle maps them to JavaScript `Date` values. Requires MySQL 8.0.13+
 * and an engine that supports expression defaults, such as InnoDB.
 *
 * @returns An object containing `updatedAt` to spread into a `mysqlTable`
 * definition.
 */
export default function updatedAt() {
  return {
    updatedAt: datetime("updated_at", { mode: "date", fsp: 3 })
      .notNull()
      .default(sql`(utc_timestamp(3))`)
      .$onUpdate(() => sql`utc_timestamp(3)`),
  };
}
