import { timestamp } from "drizzle-orm/pg-core";

/**
 * Defines nullable `timestamp` column `deleted_at`.
 *
 * Has no default or automatic update. Set `deletedAt` to soft-delete a row,
 * or `null` to restore it. Queries must filter out deleted rows explicitly.
 *
 * @param options - Timestamp options. Set `withTimezone` to `true` to use
 * `timestamp with time zone`; omitted or `false` uses `timestamp without time
 * zone`.
 *
 * @returns An object containing `deletedAt` to spread into a `pgTable`
 * definition.
 */
export default function deletedAt({
  withTimezone,
}: {
  withTimezone?: boolean;
} = {}) {
  return {
    deletedAt: timestamp("deleted_at", { withTimezone }),
  };
}
