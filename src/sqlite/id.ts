import { integer, text } from "drizzle-orm/sqlite-core";

/**
 * Defines an `id` primary key.
 *
 * `"auto"` uses an auto-incrementing integer. `"uuid"` stores UUIDs as text.
 * Drizzle generates UUIDs through `$defaultFn` when the ID is omitted.
 * Inserts outside Drizzle must supply their own UUID.
 *
 * @param strategy - ID generation strategy: `"auto"` or `"uuid"`. Defaults to
 * `"auto"`.
 *
 * @returns An object containing `id` to spread into a `sqliteTable` definition.
 */
export default function id(strategy: "auto" | "uuid" = "auto") {
  switch (strategy) {
    case "auto":
      return { id: integer("id").primaryKey({ autoIncrement: true }) };
    case "uuid":
      return {
        id: text("id")
          .primaryKey()
          .$defaultFn(() => crypto.randomUUID()),
      };
  }
}
