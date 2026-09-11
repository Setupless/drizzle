import { char, int } from "drizzle-orm/mysql-core";

/**
 * Defines an `id` primary key.
 *
 * `"auto"` uses an auto-incrementing integer. `"uuid"` stores UUIDs as
 * `char(36)`.
 * Drizzle generates UUIDs through `$defaultFn` when the ID is omitted.
 * Inserts outside Drizzle must supply their own UUID.
 *
 * @param strategy - ID generation strategy: `"auto"` or `"uuid"`. Defaults to
 * `"auto"`.
 *
 * @returns An object containing `id` to spread into a `mysqlTable` definition.
 */
export default function id(strategy: "auto" | "uuid" = "auto") {
  switch (strategy) {
    case "auto":
      return { id: int("id").primaryKey().autoincrement() };
    case "uuid":
      return {
        id: char("id", { length: 36 })
          .primaryKey()
          .$defaultFn(() => crypto.randomUUID()),
      };
  }
}
