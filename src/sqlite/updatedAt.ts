import { sql } from "drizzle-orm";
import { text } from "drizzle-orm/sqlite-core";

/**
 * Defines a non-null `updatedAt` text column. The database supplies the insert
 * default, and Drizzle supplies the value for updates it executes.
 */
export default function updatedAt() {
  return {
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(current_timestamp)`)
      .$onUpdate(() => sql`(current_timestamp)`),
  };
}
