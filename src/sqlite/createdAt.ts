import { sql } from "drizzle-orm";
import { text } from "drizzle-orm/sqlite-core";

/**
 * Defines a non-null `createdAt` text column with a database default of
 * `current_timestamp`.
 */
export default function createdAt() {
  return {
    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  };
}
