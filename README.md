# @setupless/drizzle

Setup less for your [Drizzle ORM](https://orm.drizzle.team/) schemas.
Drop in IDs, timestamps, and soft-delete columns with a few spreads.

## Install

In your project that already uses Drizzle:

```sh
npm install @setupless/drizzle
# or
bun add @setupless/drizzle
```

## Add helpers to a schema

A PostgreSQL schema using plain Drizzle:

```ts
import { sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`now()`),
  deletedAt: timestamp("deleted_at"),
});
```

The same columns and runtime behaviour with helpers:

```ts
import { pgTable, text } from "drizzle-orm/pg-core";
import { deletedAt, id, timestamps } from "@setupless/drizzle/pg";

export const users = pgTable("users", {
  ...id(),
  name: text("name").notNull(),
  ...timestamps(),
  ...deletedAt(),
});
```

Keep using properties such as `users.createdAt` in your queries. The database
column names, defaults, and update behaviour are the same in both examples.
If you add columns or change their definitions, apply those changes through your
usual Drizzle migration workflow.

Choose the import for your database. Keep your existing table definition and columns:

| Database   | Import helpers from         |
| ---------- | --------------------------- |
| PostgreSQL | `@setupless/drizzle/pg`     |
| SQLite     | `@setupless/drizzle/sqlite` |
| MySQL      | `@setupless/drizzle/mysql`  |

Use only the helpers you need. Already have an ID? Keep it. Already have
`createdAt`? Add `...updatedAt()` instead of `...timestamps()` to avoid
replacing its definition.

## Helpers

Each helper returns columns to spread into your table, using the same syntax as
`...timestamps()` above.

| Helper         | Adds                                                              |
| -------------- | ----------------------------------------------------------------- |
| `id()`         | An auto-incrementing integer primary key                          |
| `id("uuid")`   | A generated UUID primary key                                      |
| `createdAt()`  | A non-null `created_at` column, defaulting to the current time    |
| `updatedAt()`  | A non-null `updated_at` column, set on insert and Drizzle updates |
| `timestamps()` | Both `createdAt()` and `updatedAt()`                              |
| `deletedAt()`  | A nullable `deleted_at` column for soft deletion                  |

`updatedAt()` fills in the update time when you omit it from a Drizzle update.
Explicit values take precedence. Updates outside Drizzle do not set it automatically.

To soft-delete a row, set `deletedAt` to the deletion time. Set it to `null` to
restore the row. Filter queries explicitly; the helper does not hide deleted rows.

## Database differences

- **PostgreSQL:** Pass
  `{ withTimezone: true }` to `createdAt`, `updatedAt`, `timestamps`, or `deletedAt`
  for `timestamp with time zone`. The default is `timestamp without time zone`.
- **SQLite:** Timestamps are UTC text in `YYYY-MM-DD HH:MM:SS` format.
- **MySQL:** Timestamps use UTC with millisecond precision. Requires MySQL
  8.0.13+ and an engine that supports expression defaults, such as InnoDB.
  Supply UTC dates when writing timestamps through raw SQL.

PostgreSQL generates UUIDs in the database. SQLite and MySQL generate them in
Drizzle, so inserts outside Drizzle must supply their own UUID.

Licensed under [Apache 2.0](LICENSE).
