import { integer, uuid } from "drizzle-orm/pg-core";

/**
 * Defines an `id` primary key.
 *
 * `"auto"` uses an integer with `GENERATED ALWAYS AS IDENTITY`.
 * `"uuid"` uses a UUID column with a database default of `gen_random_uuid()`.
 *
 * @param strategy - ID generation strategy: `"auto"` or `"uuid"`. Defaults to
 * `"auto"`.
 *
 * @returns An object containing `id` to spread into a `pgTable` definition.
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
