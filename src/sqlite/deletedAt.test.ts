import { describe, expect, test } from "bun:test";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import deletedAt from "./deletedAt";

describe("deletedAt", () => {
  test("creates a nullable text timestamp without a default or automatic update", () => {
    const table = sqliteTable("test_table", {
      ...deletedAt(),
    });

    expect(table.deletedAt.name).toBe("deleted_at");
    expect(table.deletedAt.getSQLType()).toBe("text");
    expect(table.deletedAt.notNull).toBe(false);
    expect(table.deletedAt.hasDefault).toBe(false);
    expect(table.deletedAt.defaultFn).toBeUndefined();
    expect(table.deletedAt.default).toBeUndefined();
    expect(table.deletedAt.onUpdateFn).toBeUndefined();
  });
});
