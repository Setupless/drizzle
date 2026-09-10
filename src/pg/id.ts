import { integer, uuid } from "drizzle-orm/pg-core";

/**
 * Defines an `id` primary-key column.
 *
 * PostgreSQL generates UUID values through the column's database default.
 */
export default function id(strategy: "auto" | "uuid" = "auto") {
  switch (strategy) {
    case "auto":
      return { id: integer("id").primaryKey().generatedAlwaysAsIdentity() };
    case "uuid":
      return {
        id: uuid("id").primaryKey().defaultRandom(),
      };
  }
}
