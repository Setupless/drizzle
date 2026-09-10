import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

/**
 * Defines a non-null `updatedAt` timestamp column. The database supplies the
 * insert default, and Drizzle supplies the value for updates it executes.
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
