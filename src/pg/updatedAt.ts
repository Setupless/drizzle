import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

/**
 * Defines non-null `timestamp` column `updated_at`.
 *
 * The database uses `now()` when a value is omitted on insert.
 * When `updatedAt` is omitted from a Drizzle update, Drizzle uses `now()`.
 * Explicit values take precedence. Updates outside Drizzle do not set it
 * automatically.
 *
 * @param options - Timestamp options. Set `withTimezone` to `true` to use
 * `timestamp with time zone`; omitted or `false` uses `timestamp without time
 * zone`.
 *
 * @returns An object containing `updatedAt` to spread into a `pgTable`
 * definition.
 */
export default function updatedAt({
  withTimezone,
}: {
  withTimezone?: boolean;
} = {}) {
  return {
    updatedAt: timestamp("updated_at", { withTimezone })
      .notNull()
      .defaultNow()
      .$onUpdate(() => sql`now()`),
  };
}
