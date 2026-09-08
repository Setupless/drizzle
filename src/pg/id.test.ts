import { describe, expect, test } from "bun:test";
import { pgTable } from "drizzle-orm/pg-core";
import id from "./id";

describe("id", () => {
  test("creates an identity integer primary key by default", () => {
    const table = pgTable("test_table", {
      ...id(),
    });

    expect(table.id.getSQLType()).toBe("integer");
    expect(table.id.primary).toBe(true);
    expect(table.id).toHaveProperty("generatedIdentity");
  });

  test("creates an identity integer primary key", () => {
    const table = pgTable("test_table", {
      ...id("auto"),
    });

    expect(table.id.getSQLType()).toBe("integer");
    expect(table.id.primary).toBe(true);
    expect(table.id).toHaveProperty("generatedIdentity");
  });

  test("creates a UUID primary key", () => {
    const table = pgTable("test_table", {
      ...id("uuid"),
    });

    expect(table.id.getSQLType()).toBe("uuid");
    expect(table.id.primary).toBe(true);
    expect(table.id.hasDefault).toBe(true);
  });
});
