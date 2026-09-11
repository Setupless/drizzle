import createdAt from "./createdAt.js";
import updatedAt from "./updatedAt.js";

/**
 * Defines non-null `text` columns `created_at` and `updated_at`.
 *
 * The database uses `current_timestamp` when values are omitted on insert.
 * When `updatedAt` is omitted from a Drizzle update, Drizzle uses
 * `current_timestamp`.
 * Explicit values take precedence. Updates outside Drizzle do not set it
 * automatically.
 * Values are UTC strings in `YYYY-MM-DD HH:MM:SS` format, with second
 * precision.
 *
 * @returns An object containing `createdAt` and `updatedAt` to spread into a
 * `sqliteTable` definition.
 */
export default function timestamps() {
  return {
    ...createdAt(),
    ...updatedAt(),
  };
}
