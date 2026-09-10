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
| `timestamps()` | `createdAt()` and `updatedAt()` columns         | PostgreSQL, SQLite |

```ts
import { pgTable } from "drizzle-orm/pg-core";
import { id, timestamps } from "@setupless/drizzle/pg";

export const users = pgTable("users", {
  ...id(),
  ...timestamps({ withTimezone: true }),
});
```

Import from `/sqlite` for SQLite. The package root also exports `pg` and
`sqlite` namespaces. `updatedAt()` uses Drizzle's `$onUpdate` callback; it does
not create a database trigger for updates made outside Drizzle.

PostgreSQL timestamp helpers accept a `withTimezone` option. SQLite stores the
timestamps as text and does not accept this option.

Licensed under [Apache 2.0](LICENSE).
