import { describe, expect, test } from "bun:test";
import { SQL } from "drizzle-orm";
import { SQLiteSyncDialect, sqliteTable } from "drizzle-orm/sqlite-core";
import updatedAt from "./updatedAt";

describe("updatedAt", () => {
  test("creates a non-null text timestamp that uses the current time on insert and update", () => {
    const table = sqliteTable("test_table", {
      ...updatedAt(),
    });

    const dialect = new SQLiteSyncDialect();

    expect(table.updatedAt.name).toBe("updated_at");
    expect(table.updatedAt.getSQLType()).toBe("text");
    expect(table.updatedAt.notNull).toBe(true);
    expect(table.updatedAt.hasDefault).toBe(true);
    expect(table.updatedAt.defaultFn).toBeUndefined();
    expect(table.updatedAt.default).toBeInstanceOf(SQL);

    const updatedAtDefault = table.updatedAt.default;
    if (!(updatedAtDefault instanceof SQL)) {
      throw new Error("Expected updatedAt to have a SQL default");
    }
    expect(dialect.sqlToQuery(updatedAtDefault).sql).toBe(
      "(current_timestamp)",
    );

    expect(table.updatedAt.onUpdateFn).toBeFunction();
    const updateValue = table.updatedAt.onUpdateFn?.();
    if (!(updateValue instanceof SQL)) {
      throw new Error("Expected updatedAt to use a SQL timestamp on update");
    }
    expect(dialect.sqlToQuery(updateValue).sql).toBe("(current_timestamp)");
  });
});
