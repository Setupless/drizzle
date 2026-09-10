import { char, int } from "drizzle-orm/mysql-core";

/**
 * Defines an `id` primary-key column.
 *
 * Drizzle generates UUID values in the application through `$defaultFn`.
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
