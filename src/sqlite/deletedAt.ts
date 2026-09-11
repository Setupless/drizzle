import { text } from "drizzle-orm/sqlite-core";

/**
 * Defines nullable `text` column `deleted_at`.
 *
 * Has no default or automatic update. Set `deletedAt` to soft-delete a row,
 * or `null` to restore it. Queries must filter out deleted rows explicitly.
 * Use UTC text in `YYYY-MM-DD HH:MM:SS` format to match the timestamp helpers.
 *
 * @returns An object containing `deletedAt` to spread into a `sqliteTable`
 * definition.
 */
export default function deletedAt() {
  return {
    deletedAt: text("deleted_at"),
  };
}
