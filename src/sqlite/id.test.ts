import { describe, expect, test } from "bun:test";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import id from "./id";

describe("id", () => {
  test("creates an auto-incrementing integer primary key by default", () => {
    const table = sqliteTable("test_table", {
      ...id(),
    });

    expect(table.id.getSQLType()).toBe("integer");
    expect(table.id.primary).toBe(true);
    expect(table.id).toHaveProperty("autoIncrement", true);
  });
  test("creates an auto-incrementing integer primary key", () => {
    const table = sqliteTable("test_table", {
      ...id("auto"),
    });

    expect(table.id.getSQLType()).toBe("integer");
    expect(table.id.primary).toBe(true);
    expect(table.id).toHaveProperty("autoIncrement", true);
  });
  test("creates a UUID text primary key", () => {
    const table = sqliteTable("test_table", {
      ...id("uuid"),
    });

    expect(table.id.getSQLType()).toBe("text");
    expect(table.id.primary).toBe(true);
    expect(table.id.defaultFn?.()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });
});
