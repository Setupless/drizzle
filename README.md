# @setupless/drizzle

Shared [Drizzle ORM](https://orm.drizzle.team/) schema helpers for Setupless packages.

```sh
npm install @setupless/drizzle drizzle-orm
# or: bun add @setupless/drizzle drizzle-orm
```

| Function     | Description                           | Databases          |
| ------------ | ------------------------------------- | ------------------ |
| `id()`       | Auto-incrementing integer primary key | PostgreSQL, SQLite |
| `id("uuid")` | Generated UUID primary key            | PostgreSQL, SQLite |

```ts
import { pgTable } from "drizzle-orm/pg-core";
import { id } from "@setupless/drizzle/pg";

export const users = pgTable("users", {
  ...id(),
});
```

Import from `/sqlite` for SQLite. The package root also exports `pg` and
`sqlite` namespaces.

Licensed under [Apache 2.0](LICENSE).
