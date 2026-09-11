import { datetime } from "drizzle-orm/mysql-core";

/**
 * Defines nullable `datetime(3)` column `deleted_at`.
 *
 * Has no default or automatic update. Set `deletedAt` to soft-delete a row,
 * or `null` to restore it. Queries must filter out deleted rows explicitly.
 * Pass a JavaScript `Date` through Drizzle, or supply UTC values in raw SQL.
 *
 * @returns An object containing `deletedAt` to spread into a `mysqlTable`
 * definition.
 */
export default function deletedAt() {
  return {
    deletedAt: datetime("deleted_at", { mode: "date", fsp: 3 }),
  };
}
