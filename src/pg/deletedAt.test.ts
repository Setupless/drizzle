import { describe, expect, test } from "bun:test";
import { pgTable } from "drizzle-orm/pg-core";
import deletedAt from "./deletedAt";

describe("deletedAt", () => {
  test.each([
    ["default", undefined, "timestamp"],
    ["empty", {}, "timestamp"],
    ["timezone disabled", { withTimezone: false }, "timestamp"],
    ["timezone enabled", { withTimezone: true }, "timestamp with time zone"],
  ] as const)(
    "creates the expected columns with %s options",
    (_label, options, sqlType) => {
      const table = pgTable("test_table", {
        ...deletedAt(options),
      });

      expect(table.deletedAt.name).toBe("deleted_at");
      expect(table.deletedAt.getSQLType()).toBe(sqlType);
      expect(table.deletedAt.notNull).toBe(false);
      expect(table.deletedAt.hasDefault).toBe(false);
      expect(table.deletedAt.defaultFn).toBeUndefined();
      expect(table.deletedAt.default).toBeUndefined();
      expect(table.deletedAt.onUpdateFn).toBeUndefined();
    },
  );
});
