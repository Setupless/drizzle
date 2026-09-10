import { describe, expect, test } from "bun:test";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import id from "./id";

describe("id", () => {
  test("creates an auto-incrementing integer primary key by default", () => {
    const table = sqliteTable("test_table", {
      ...id(),
    });

    expect(table.id.name).toBe("id");
    expect(table.id.notNull).toBe(true);
    expect(table.id.getSQLType()).toBe("integer");
    expect(table.id.primary).toBe(true);
    expect(table.id).toHaveProperty("autoIncrement", true);
    expect(table.id.hasDefault).toBe(true);
    expect(table.id.default).toBeUndefined();
    expect(table.id.defaultFn).toBeUndefined();
  });

  test("creates an auto-incrementing integer primary key", () => {
    const table = sqliteTable("test_table", {
      ...id("auto"),
    });

    expect(table.id.name).toBe("id");
    expect(table.id.notNull).toBe(true);
    expect(table.id.getSQLType()).toBe("integer");
    expect(table.id.primary).toBe(true);
    expect(table.id).toHaveProperty("autoIncrement", true);
    expect(table.id.hasDefault).toBe(true);
    expect(table.id.default).toBeUndefined();
    expect(table.id.defaultFn).toBeUndefined();
  });

  test("creates a UUID text primary key", () => {
    const table = sqliteTable("test_table", {
      ...id("uuid"),
    });

    expect(table.id.name).toBe("id");
    expect(table.id.notNull).toBe(true);
    expect(table.id.getSQLType()).toBe("text");
    expect(table.id.primary).toBe(true);
    expect(table.id.hasDefault).toBe(true);
    expect(table.id.default).toBeUndefined();
    expect(table.id.defaultFn).toBeFunction();
    const firstId = table.id.defaultFn?.();
    const secondId = table.id.defaultFn?.();
    expect(firstId).not.toBe(secondId);
    expect(firstId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });
});
