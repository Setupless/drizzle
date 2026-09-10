import { describe, expect, test } from "bun:test";
import { SQL } from "drizzle-orm";
import { PgDialect, pgTable } from "drizzle-orm/pg-core";
import id from "./id";

describe("id", () => {
  test("creates an identity integer primary key by default", () => {
    const table = pgTable("test_table", {
      ...id(),
    });

    expect(table.id.name).toBe("id");
    expect(table.id.notNull).toBe(true);
    expect(table.id.getSQLType()).toBe("integer");
    expect(table.id.primary).toBe(true);
    expect(table.id).toHaveProperty("generatedIdentity.type", "always");
    expect(table.id.hasDefault).toBe(true);
    expect(table.id.default).toBeUndefined();
    expect(table.id.defaultFn).toBeUndefined();
  });

  test("creates an identity integer primary key", () => {
    const table = pgTable("test_table", {
      ...id("auto"),
    });

    expect(table.id.name).toBe("id");
    expect(table.id.notNull).toBe(true);
    expect(table.id.getSQLType()).toBe("integer");
    expect(table.id.primary).toBe(true);
    expect(table.id).toHaveProperty("generatedIdentity.type", "always");
    expect(table.id.hasDefault).toBe(true);
    expect(table.id.default).toBeUndefined();
    expect(table.id.defaultFn).toBeUndefined();
  });

  test("creates a UUID primary key", () => {
    const table = pgTable("test_table", {
      ...id("uuid"),
    });

    expect(table.id.name).toBe("id");
    expect(table.id.notNull).toBe(true);
    expect(table.id.getSQLType()).toBe("uuid");
    expect(table.id.primary).toBe(true);
    expect(table.id.hasDefault).toBe(true);
    expect(table.id.defaultFn).toBeUndefined();
    expect(table.id.default).toBeInstanceOf(SQL);
    if (!(table.id.default instanceof SQL)) {
      throw new Error("Expected id to have a SQL UUID default");
    }
    expect(new PgDialect().sqlToQuery(table.id.default).sql).toBe(
      "gen_random_uuid()",
    );
  });
});
