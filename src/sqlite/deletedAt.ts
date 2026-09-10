import { text } from "drizzle-orm/sqlite-core";

/**
 * Defines a nullable `deletedAt` text column named `deleted_at` for soft deletion.
 * Has no default or automatic update. Set the timestamp text when deleting a row.
 */
export default function deletedAt() {
  return {
    deletedAt: text("deleted_at"),
  };
}
