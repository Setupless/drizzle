import { describe, expect, test } from "bun:test";
import { SQL } from "drizzle-orm";
import { MySqlDialect, mysqlTable, varchar } from "drizzle-orm/mysql-core";
const dialect = new MySqlDialect();
import { drizzle } from "drizzle-orm/mysql-proxy";
const db = drizzle(async () => ({ rows: [] }));

import timestamps from "./timestamps";

describe("timestamps", () => {
  test("creates millisecond date columns with UTC expression defaults", () => {
    const table = mysqlTable("users", { ...timestamps() });
    for (const column of [table.createdAt, table.updatedAt]) {
      expect(column.getSQLType()).toBe("datetime(3)");
      expect(column.notNull).toBe(true);
      expect(column.hasDefault).toBe(true);
      expect(column.default).toBeInstanceOf(SQL);
      expect(dialect.sqlToQuery(column.default as SQL).sql).toBe(
        "(utc_timestamp(3))",
      );
      expect(column.defaultFn).toBeUndefined();
      const date = new Date("2040-01-02T03:04:05.123Z");
      expect(column.mapToDriverValue(date)).toBe("2040-01-02 03:04:05.123");
      expect(column.mapFromDriverValue("2040-01-02 03:04:05.123")).toEqual(
        date,
      );
    }
    expect(table.createdAt.name).toBe("created_at");
    expect(table.updatedAt.name).toBe("updated_at");
    expect(table.createdAt.onUpdateFn).toBeUndefined();
  });

  test("updates updatedAt through Drizzle and preserves explicit values", () => {
    const table = mysqlTable("users", {
      name: varchar("name", { length: 100 }),
      ...timestamps(),
    });
    const query = db.update(table).set({ name: "Alice" }).toSQL();
    expect(query.sql).toContain("`updated_at` = utc_timestamp(3)");
    expect(query.sql).not.toContain("`created_at` =");
    const explicit = db
      .update(table)
      .set({ updatedAt: new Date("2040-01-02T03:04:05.123Z") })
      .toSQL();
    expect(explicit.sql).not.toContain("utc_timestamp(3)");
    expect(explicit.params).toEqual(["2040-01-02 03:04:05.123"]);
    const insert = db.insert(table).values({ name: "Alice" }).toSQL();
    expect(insert.sql).toContain("values (?, default, default)");
    expect(insert.params).toEqual(["Alice"]);
  });
});
