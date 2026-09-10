import { describe, expect, test } from "bun:test";
import { SQL } from "drizzle-orm";
import { SQLiteSyncDialect, sqliteTable } from "drizzle-orm/sqlite-core";
import updatedAt from "./updatedAt";

describe("updatedAt", () => {
  test("creates a non-null text timestamp for insert and update", () => {
    const table = sqliteTable("test_table", {
      ...updatedAt(),
    });

    expect(table.updatedAt.name).toBe("updated_at");
    expect(table.updatedAt.getSQLType()).toBe("text");
    expect(table.updatedAt.notNull).toBe(true);
    expect(table.updatedAt.hasDefault).toBe(true);
    expect(table.updatedAt.default).toBeInstanceOf(SQL);
    expect(table.updatedAt.onUpdateFn).toBeFunction();

    const defaultValue = table.updatedAt.default;
    const updateValue = table.updatedAt.onUpdateFn?.();

    if (!(defaultValue instanceof SQL) || !(updateValue instanceof SQL)) {
      throw new Error("Expected updatedAt to use SQL timestamps");
    }

    const dialect = new SQLiteSyncDialect();
    expect(dialect.sqlToQuery(defaultValue).sql).toBe("(current_timestamp)");
    expect(dialect.sqlToQuery(updateValue).sql).toBe("(current_timestamp)");
  });
});
