import { timestamp } from "drizzle-orm/pg-core";

/**
 * Defines a nullable `deletedAt` timestamp column named `deleted_at` for soft deletion.
 * Has no default or automatic update. Set the timestamp when deleting a row.
 *
 * @param options - Set `withTimezone` to `true` to use `timestamp with time zone`.
 * Defaults to `timestamp` without a time zone.
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
