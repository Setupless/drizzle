import { describe, expect, test } from "bun:test";
import { SQL } from "drizzle-orm";
import { PgDialect, pgTable } from "drizzle-orm/pg-core";
import createdAt from "./createdAt";

describe("createdAt", () => {
  test.each([
    ["default", undefined, "timestamp"],
    ["empty", {}, "timestamp"],
    ["timezone disabled", { withTimezone: false }, "timestamp"],
    ["timezone enabled", { withTimezone: true }, "timestamp with time zone"],
  ] as const)(
    "creates the expected columns with %s options",
    (_label, options, sqlType) => {
      const table = pgTable("test_table", {
        ...createdAt(options),
      });

      const dialect = new PgDialect();

      expect(table.createdAt.name).toBe("created_at");
      expect(table.createdAt.getSQLType()).toBe(sqlType);
      expect(table.createdAt.notNull).toBe(true);
      expect(table.createdAt.hasDefault).toBe(true);
      expect(table.createdAt.defaultFn).toBeUndefined();
      expect(table.createdAt.default).toBeInstanceOf(SQL);

      const createdAtDefault = table.createdAt.default;
      if (!(createdAtDefault instanceof SQL)) {
        throw new Error("Expected createdAt to have a SQL default");
      }
      expect(dialect.sqlToQuery(createdAtDefault).sql).toBe("now()");
      expect(table.createdAt.onUpdateFn).toBeUndefined();
    },
  );
});
