import { describe, expect, test } from "bun:test";
import { SQL } from "drizzle-orm";
import { SQLiteSyncDialect, sqliteTable } from "drizzle-orm/sqlite-core";
import timestamps from "./timestamps";

describe("timestamps", () => {
  test("creates non-null createdAt and updatedAt timestamps with insert and update defaults", () => {
    const table = sqliteTable("test_table", {
      ...timestamps(),
    });

    const dialect = new SQLiteSyncDialect();

    expect(table.createdAt.name).toBe("created_at");
    expect(table.createdAt.getSQLType()).toBe("text");
    expect(table.createdAt.notNull).toBe(true);
    expect(table.createdAt.hasDefault).toBe(true);
    expect(table.createdAt.defaultFn).toBeUndefined();
    expect(table.createdAt.default).toBeInstanceOf(SQL);

    const createdAtDefault = table.createdAt.default;
    if (!(createdAtDefault instanceof SQL)) {
      throw new Error("Expected createdAt to have a SQL default");
    }
    expect(dialect.sqlToQuery(createdAtDefault).sql).toBe(
      "(current_timestamp)",
    );
    expect(table.createdAt.onUpdateFn).toBeUndefined();

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
