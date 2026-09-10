import { describe, expect, test } from "bun:test";
import { SQL } from "drizzle-orm";
import { MySqlDialect, mysqlTable } from "drizzle-orm/mysql-core";
const dialect = new MySqlDialect();

import updatedAt from "./updatedAt";

describe("updatedAt", () => {
  test("creates a millisecond date column with a UTC expression default", () => {
    const table = mysqlTable("users", { ...updatedAt() });
    const column = table.updatedAt;
    expect(column.name).toBe("updated_at");
    expect(column.getSQLType()).toBe("datetime(3)");
    expect(column.notNull).toBe(true);
    expect(column.hasDefault).toBe(true);
    expect(column.defaultFn).toBeUndefined();
    expect(column.default).toBeInstanceOf(SQL);
    if (!(column.default instanceof SQL))
      throw new Error("Expected a SQL default");
    expect(dialect.sqlToQuery(column.default).sql).toBe("(utc_timestamp(3))");
    const date = new Date("2040-01-02T03:04:05.123Z");
    expect(column.mapToDriverValue(date)).toBe("2040-01-02 03:04:05.123");
    expect(column.mapFromDriverValue("2040-01-02 03:04:05.123")).toEqual(date);
    const update = column.onUpdateFn?.();
    expect(update).toBeInstanceOf(SQL);
    if (!(update instanceof SQL)) throw new Error("Expected a SQL update");
    expect(dialect.sqlToQuery(update).sql).toBe("utc_timestamp(3)");
  });
});
