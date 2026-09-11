import createdAt from "./createdAt.js";
import updatedAt from "./updatedAt.js";

/**
 * Defines non-null `datetime(3)` columns `created_at` and `updated_at`.
 *
 * The database uses `utc_timestamp(3)` when values are omitted on insert.
 * When `updatedAt` is omitted from a Drizzle update, Drizzle uses
 * `utc_timestamp(3)`.
 * Explicit values take precedence. Updates outside Drizzle do not set it
 * automatically.
 * Values use UTC with millisecond precision, independent of the session
 * timezone.
 * Drizzle maps them to JavaScript `Date` values. Requires MySQL 8.0.13+
 * and an engine that supports expression defaults, such as InnoDB.
 *
 * @returns An object containing `createdAt` and `updatedAt` to spread into a
 * `mysqlTable` definition.
 */
export default function timestamps() {
  return {
    ...createdAt(),
    ...updatedAt(),
  };
}
