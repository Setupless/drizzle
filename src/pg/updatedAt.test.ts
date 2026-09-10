import { describe, expect, test } from "bun:test";
import { SQL } from "drizzle-orm";
import { PgDialect, pgTable } from "drizzle-orm/pg-core";
import updatedAt from "./updatedAt";

describe("updatedAt", () => {
  test.each([
    ["default", undefined, "timestamp"],
    ["empty", {}, "timestamp"],
    ["timezone disabled", { withTimezone: false }, "timestamp"],
    ["timezone enabled", { withTimezone: true }, "timestamp with time zone"],
  ] as const)(
    "creates the expected columns with %s options",
    (_label, options, sqlType) => {
      const table = pgTable("test_table", {
        ...updatedAt(options),
      });

      const dialect = new PgDialect();

      expect(table.updatedAt.name).toBe("updated_at");
      expect(table.updatedAt.getSQLType()).toBe(sqlType);
      expect(table.updatedAt.notNull).toBe(true);
      expect(table.updatedAt.hasDefault).toBe(true);
      expect(table.updatedAt.defaultFn).toBeUndefined();
      expect(table.updatedAt.default).toBeInstanceOf(SQL);

      const updatedAtDefault = table.updatedAt.default;
      if (!(updatedAtDefault instanceof SQL)) {
        throw new Error("Expected updatedAt to have a SQL default");
      }
      expect(dialect.sqlToQuery(updatedAtDefault).sql).toBe("now()");

      expect(table.updatedAt.onUpdateFn).toBeFunction();
      const updateValue = table.updatedAt.onUpdateFn?.();
      if (!(updateValue instanceof SQL)) {
        throw new Error("Expected updatedAt to use a SQL timestamp on update");
      }
      expect(dialect.sqlToQuery(updateValue).sql).toBe("now()");
    },
  );
});
