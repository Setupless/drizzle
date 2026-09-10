import { describe, expect, test } from "bun:test";
import { pgTable } from "drizzle-orm/pg-core";
import timestamps from "./timestamps";

describe("timestamps", () => {
  test("creates createdAt and updatedAt timestamps", () => {
    const table = pgTable("test_table", {
      ...timestamps(),
    });

    expect(table.createdAt.name).toBe("created_at");
    expect(table.createdAt.getSQLType()).toBe("timestamp");
    expect(table.updatedAt.name).toBe("updated_at");
    expect(table.updatedAt.getSQLType()).toBe("timestamp");
  });

  test("passes withTimezone to both timestamps", () => {
    const table = pgTable("test_table", {
      ...timestamps({ withTimezone: true }),
    });

    expect(table.createdAt.getSQLType()).toBe("timestamp with time zone");
    expect(table.updatedAt.getSQLType()).toBe("timestamp with time zone");
  });
});
