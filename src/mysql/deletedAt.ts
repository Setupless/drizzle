import { datetime } from "drizzle-orm/mysql-core";

/**
 * Defines a nullable `deletedAt` DATETIME(3) column named `deleted_at` for soft deletion.
 * Has no default or automatic update. Set the timestamp when deleting a row.
 * Pass a JavaScript Date through Drizzle, or supply UTC values in raw SQL.
 */
export default function deletedAt() {
  return {
    deletedAt: datetime("deleted_at", { mode: "date", fsp: 3 }),
  };
}
