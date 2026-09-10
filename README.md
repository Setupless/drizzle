# @setupless/drizzle

Shared [Drizzle ORM](https://orm.drizzle.team/) schema helpers for Setupless packages.

```sh
npm install @setupless/drizzle drizzle-orm
# or: bun add @setupless/drizzle drizzle-orm
```

| Function       | Description                                     | Databases          |
| -------------- | ----------------------------------------------- | ------------------ |
| `id()`         | Auto-incrementing integer primary key           | PostgreSQL, SQLite |
| `id("uuid")`   | Generated UUID primary key                      | PostgreSQL, SQLite |
| `createdAt()`  | Timestamp with the current time as its default  | PostgreSQL, SQLite |
| `updatedAt()`  | Timestamp set on insert and Drizzle-run updates | PostgreSQL, SQLite |
| `deletedAt()`  | Nullable timestamp for soft deletion            | PostgreSQL, SQLite |
| `timestamps()` | `createdAt()` and `updatedAt()` columns         | PostgreSQL, SQLite |

```ts
import { pgTable } from "drizzle-orm/pg-core";
import { deletedAt, id, timestamps } from "@setupless/drizzle/pg";

export const users = pgTable("users", {
  ...id(),
  ...timestamps({ withTimezone: true }),
  ...deletedAt({ withTimezone: true }),
});
```

Import from `/sqlite` for SQLite. The package root also exports `pg` and
`sqlite` namespaces. `updatedAt()` uses Drizzle's `$onUpdate` callback; it does
not create a database trigger for updates made outside Drizzle.

`deletedAt()` adds a nullable `deleted_at` column with no default or automatic
update. Set it when soft-deleting a row, and set it to `null` to restore the row.
Queries must filter out soft-deleted rows explicitly.

PostgreSQL timestamp helpers accept a `withTimezone` option. SQLite stores the
timestamps as text and does not accept this option.

Licensed under [Apache 2.0](LICENSE).
