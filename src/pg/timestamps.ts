import createdAt from "./createdAt.js";
import updatedAt from "./updatedAt.js";

/**
 * Defines non-null `timestamp` columns `created_at` and `updated_at`.
 *
 * The database uses `now()` when values are omitted on insert.
 * When `updatedAt` is omitted from a Drizzle update, Drizzle uses `now()`.
 * Explicit values take precedence. Updates outside Drizzle do not set it
 * automatically.
 *
 * @param options - Timestamp options. Set `withTimezone` to `true` to use
 * `timestamp with time zone`; omitted or `false` uses `timestamp without time
 * zone`.
 *
 * @returns An object containing `createdAt` and `updatedAt` to spread into a
 * `pgTable` definition.
 */
export default function timestamps({
  withTimezone,
}: {
  withTimezone?: boolean;
} = {}) {
  return {
    ...createdAt({ withTimezone }),
    ...updatedAt({ withTimezone }),
  };
}
