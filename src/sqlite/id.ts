import { integer, text } from "drizzle-orm/sqlite-core";

/**
 * Defines an `id` primary-key column.
 *
 * Drizzle generates UUID values in the application through `$defaultFn`.
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
