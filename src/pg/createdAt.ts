import { timestamp } from "drizzle-orm/pg-core";

/**
 * Defines a non-null `createdAt` timestamp column with a database default of
 * `now()`.
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
