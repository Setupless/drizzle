import { describe, expect, test } from "bun:test";
import { SQL } from "drizzle-orm";
import { PgDialect, pgTable } from "drizzle-orm/pg-core";
import updatedAt from "./updatedAt";

describe("updatedAt", () => {
  test("creates a non-null timestamp that uses now on insert and update", () => {
    const table = pgTable("test_table", {
      ...updatedAt(),
    });

    expect(table.updatedAt.name).toBe("updated_at");
    expect(table.updatedAt.getSQLType()).toBe("timestamp");
    expect(table.updatedAt.notNull).toBe(true);
    expect(table.updatedAt.hasDefault).toBe(true);
    expect(table.updatedAt.default).toBeInstanceOf(SQL);
    expect(table.updatedAt.onUpdateFn).toBeFunction();

    const defaultValue = table.updatedAt.default;
    const updateValue = table.updatedAt.onUpdateFn?.();

    if (!(defaultValue instanceof SQL) || !(updateValue instanceof SQL)) {
      throw new Error("Expected updatedAt to use SQL timestamps");
    }

    const dialect = new PgDialect();
    expect(dialect.sqlToQuery(defaultValue).sql).toBe("now()");
    expect(dialect.sqlToQuery(updateValue).sql).toBe("now()");
  });
});
