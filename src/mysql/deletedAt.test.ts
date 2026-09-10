import { describe, expect, test } from "bun:test";
import { mysqlTable } from "drizzle-orm/mysql-core";
import { drizzle } from "drizzle-orm/mysql-proxy";
const db = drizzle(async () => ({ rows: [] }));

import deletedAt from "./deletedAt";

describe("deletedAt", () => {
  test("keeps deletedAt nullable without defaults or automatic updates", () => {
    const table = mysqlTable("users", { ...deletedAt() });
    expect(table.deletedAt.name).toBe("deleted_at");
    expect(table.deletedAt.getSQLType()).toBe("datetime(3)");
    expect(table.deletedAt.notNull).toBe(false);
    expect(table.deletedAt.hasDefault).toBe(false);
    expect(table.deletedAt.default).toBeUndefined();
    expect(table.deletedAt.defaultFn).toBeUndefined();
    expect(table.deletedAt.onUpdateFn).toBeUndefined();
    expect(db.update(table).set({ deletedAt: null }).toSQL().params).toEqual([
      null,
    ]);
  });
});
