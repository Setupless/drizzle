import { describe, expect, test } from "bun:test";
import { mysqlTable } from "drizzle-orm/mysql-core";
import { drizzle } from "drizzle-orm/mysql-proxy";
const db = drizzle(async () => ({ rows: [] }));

import id from "./id";

describe("id", () => {
  test.each([undefined, "auto"] as const)(
    "creates an auto-incrementing primary key with %s",
    (strategy) => {
      const table = mysqlTable("users", { ...id(strategy) });
      expect(table.id.getSQLType()).toBe("int");
      expect(table.id.primary).toBe(true);
      expect(table.id.notNull).toBe(true);
      expect(table.id.hasDefault).toBe(true);
      expect(table.id).toHaveProperty("autoIncrement", true);
    },
  );

  test("generates a UUID for each omitted ID on insert", () => {
    const table = mysqlTable("users", { ...id("uuid") });
    expect(table.id.getSQLType()).toBe("char(36)");
    expect(table.id.primary).toBe(true);
    expect(table.id.notNull).toBe(true);
    expect(table.id.default).toBeUndefined();
    const query = db.insert(table).values([{}, {}]).toSQL();
    expect(query.params).toHaveLength(2);
    for (const value of query.params) {
      expect(value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
    }
    expect(query.params[0]).not.toBe(query.params[1]);
  });
});
