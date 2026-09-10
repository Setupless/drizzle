# @setupless/drizzle

Shared [Drizzle ORM](https://orm.drizzle.team/) schema helpers for Setupless packages.

```sh
npm install @setupless/drizzle drizzle-orm
# or: bun add @setupless/drizzle drizzle-orm
```

| Function       | Description                                     | Databases                 |
| -------------- | ----------------------------------------------- | ------------------------- |
| `id()`         | Auto-incrementing integer primary key           | PostgreSQL, SQLite, MySQL |
| `id("uuid")`   | Generated UUID primary key                      | PostgreSQL, SQLite, MySQL |
| `createdAt()`  | Timestamp with the current time as its default  | PostgreSQL, SQLite, MySQL |
| `updatedAt()`  | Timestamp set on insert and Drizzle-run updates | PostgreSQL, SQLite, MySQL |
| `deletedAt()`  | Nullable timestamp for soft deletion            | PostgreSQL, SQLite, MySQL |
| `timestamps()` | `createdAt()` and `updatedAt()` columns         | PostgreSQL, SQLite, MySQL |

```ts
import { pgTable } from "drizzle-orm/pg-core";
import { deletedAt, id, timestamps } from "@setupless/drizzle/pg";

export const users = pgTable("users", {
  ...id(),
  ...timestamps({ withTimezone: true }),
  ...deletedAt({ withTimezone: true }),
});
```

Import from `/sqlite` for SQLite or `/mysql` for MySQL. The package root also
exports `pg`, `sqlite`, and `mysql` namespaces. `updatedAt()` uses Drizzle's `$onUpdate` callback; it does
not create a database trigger for updates made outside Drizzle.

`deletedAt()` adds a nullable `deleted_at` column with no default or automatic
update. Set it when soft-deleting a row, and set it to `null` to restore the row.
Queries must filter out soft-deleted rows explicitly.

PostgreSQL timestamp helpers accept a `withTimezone` option. SQLite stores the
timestamps as text and does not accept this option.

MySQL helpers require MySQL 8.0.13+ and use `DATETIME(3)` with JavaScript `Date`
values and millisecond precision. They do not accept `withTimezone`.
`createdAt()` and `updatedAt()` default to `(utc_timestamp(3))`, and Drizzle
updates use `utc_timestamp(3)`. These values stay in UTC regardless of the
MySQL session timezone, matching Drizzle's UTC date mapping. Expression defaults
require MySQL 8.0.13+ and a supporting storage engine such as InnoDB.

`DATETIME` stores no timezone information. Pass JavaScript `Date` values through
Drizzle when setting dates explicitly, including `deletedAt`. External writers
must supply UTC values, for example with `UTC_TIMESTAMP(3)` rather than `NOW(3)`.

```ts
import { mysqlTable } from "drizzle-orm/mysql-core";
import { deletedAt, id, timestamps } from "@setupless/drizzle/mysql";

export const users = mysqlTable("users", {
  ...id(),
  ...timestamps(),
  ...deletedAt(),
});
```

MySQL `id("uuid")` uses `CHAR(36)` and generates UUIDs in Drizzle through
`$defaultFn`. Inserts outside Drizzle must supply their own UUID.

Licensed under [Apache 2.0](LICENSE).
