import { describe, expect, test } from "bun:test";
import { SQL } from "drizzle-orm";
import { SQLiteSyncDialect, sqliteTable } from "drizzle-orm/sqlite-core";
import createdAt from "./createdAt";

describe("createdAt", () => {
  test("creates a non-null text timestamp that defaults to the current time", () => {
    const table = sqliteTable("test_table", {
      ...createdAt(),
    });

    expect(table.createdAt.name).toBe("created_at");
    expect(table.createdAt.getSQLType()).toBe("text");
    expect(table.createdAt.notNull).toBe(true);
    expect(table.createdAt.hasDefault).toBe(true);
    expect(table.createdAt.default).toBeInstanceOf(SQL);

    if (!(table.createdAt.default instanceof SQL)) {
      throw new Error("Expected createdAt to have a SQL default");
    }

    expect(
      new SQLiteSyncDialect().sqlToQuery(table.createdAt.default).sql,
    ).toBe("(current_timestamp)");
  });
});
