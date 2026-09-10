import { describe, expect, test } from "bun:test";
import { SQL } from "drizzle-orm";
import { PgDialect, pgTable } from "drizzle-orm/pg-core";
import createdAt from "./createdAt";

describe("createdAt", () => {
  test("creates a non-null timestamp that defaults to now", () => {
    const table = pgTable("test_table", {
      ...createdAt(),
    });

    expect(table.createdAt.name).toBe("created_at");
    expect(table.createdAt.getSQLType()).toBe("timestamp");
    expect(table.createdAt.notNull).toBe(true);
    expect(table.createdAt.hasDefault).toBe(true);
    expect(table.createdAt.default).toBeInstanceOf(SQL);

    if (!(table.createdAt.default instanceof SQL)) {
      throw new Error("Expected createdAt to have a SQL default");
    }

    expect(new PgDialect().sqlToQuery(table.createdAt.default).sql).toBe(
      "now()",
    );
  });
});
