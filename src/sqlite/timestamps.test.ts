import { describe, expect, test } from "bun:test";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import timestamps from "./timestamps";

describe("timestamps", () => {
  test("creates createdAt and updatedAt timestamps", () => {
    const table = sqliteTable("test_table", {
      ...timestamps(),
    });

    expect(table.createdAt.name).toBe("created_at");
    expect(table.createdAt.getSQLType()).toBe("text");
    expect(table.updatedAt.name).toBe("updated_at");
    expect(table.updatedAt.getSQLType()).toBe("text");
  });
});
