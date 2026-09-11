import { timestamp } from "drizzle-orm/pg-core";

/**
 * Defines non-null `timestamp` column `created_at`.
 *
 * The database uses `now()` when a value is omitted on insert.
 *
 * @param options - Timestamp options. Set `withTimezone` to `true` to use
 * `timestamp with time zone`; omitted or `false` uses `timestamp without time
 * zone`.
 *
 * @returns An object containing `createdAt` to spread into a `pgTable`
 * definition.
 */
export default function createdAt({
  withTimezone,
}: {
  withTimezone?: boolean;
} = {}) {
  return {
    createdAt: timestamp("created_at", { withTimezone }).notNull().defaultNow(),
  };
}
