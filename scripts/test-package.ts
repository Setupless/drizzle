import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const packageRoot = resolve(import.meta.dirname, "..");
const temporaryDirectory = mkdtempSync(join(tmpdir(), "setupless-drizzle-"));
const drizzleVersion = process.env.DRIZZLE_VERSION ?? "0.45.2";
let archivePath: string | undefined;

function run(command: string, arguments_: string[], cwd = packageRoot) {
  execFileSync(command, arguments_, { cwd, stdio: "inherit" });
}

try {
  run("bun", ["run", "build"]);

  const archiveName = execFileSync(
    "npm",
    ["pack", "--silent", "--ignore-scripts"],
    {
      cwd: packageRoot,
      encoding: "utf8",
    },
  ).trim();
  archivePath = join(packageRoot, archiveName);

  writeFileSync(
    join(temporaryDirectory, "package.json"),
    JSON.stringify({ private: true, type: "module" }),
  );
  run(
    "npm",
    [
      "install",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      archivePath,
      `drizzle-orm@${drizzleVersion}`,
      "typescript@^5",
    ],
    temporaryDirectory,
  );
  const smokeTest = `import { pgTable } from "drizzle-orm/pg-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import { mysqlTable } from "drizzle-orm/mysql-core";
import { createdAt as mysqlCreatedAt, deletedAt as mysqlDeletedAt, id as mysqlId, timestamps as mysqlTimestamps, updatedAt as mysqlUpdatedAt } from "@setupless/drizzle/mysql";
import { pg, sqlite, mysql } from "@setupless/drizzle";
import { createdAt as pgCreatedAt, deletedAt as pgDeletedAt, id as pgId, timestamps as pgTimestamps, updatedAt as pgUpdatedAt } from "@setupless/drizzle/pg";
import { createdAt as sqliteCreatedAt, deletedAt as sqliteDeletedAt, id as sqliteId, timestamps as sqliteTimestamps, updatedAt as sqliteUpdatedAt } from "@setupless/drizzle/sqlite";

const pgTableDefinition = pgTable("users", { ...pgId(), ...pgTimestamps(), ...pgDeletedAt() });
const sqliteTableDefinition = sqliteTable("users", { ...sqliteId("uuid"), ...sqliteTimestamps(), ...sqliteDeletedAt() });

if (pg.deletedAt !== pgDeletedAt || pg.id !== pgId || pg.createdAt !== pgCreatedAt || pg.timestamps !== pgTimestamps || pg.updatedAt !== pgUpdatedAt) throw new Error("PostgreSQL root exports do not match subpath exports");
if (sqlite.deletedAt !== sqliteDeletedAt || sqlite.id !== sqliteId || sqlite.createdAt !== sqliteCreatedAt || sqlite.timestamps !== sqliteTimestamps || sqlite.updatedAt !== sqliteUpdatedAt) throw new Error("SQLite root exports do not match subpath exports");
if (pgTableDefinition.id.getSQLType() !== "integer") throw new Error("PostgreSQL helper failed");
if (pgTableDefinition.createdAt.getSQLType() !== "timestamp") throw new Error("PostgreSQL createdAt helper failed");
if (pgTableDefinition.updatedAt.getSQLType() !== "timestamp") throw new Error("PostgreSQL updatedAt helper failed");
if (pgTableDefinition.deletedAt.getSQLType() !== "timestamp" || pgTableDefinition.deletedAt.notNull || pgTableDefinition.deletedAt.hasDefault) throw new Error("pg deletedAt helper failed");
if (sqliteTableDefinition.id.getSQLType() !== "text") throw new Error("SQLite helper failed");
if (sqliteTableDefinition.createdAt.getSQLType() !== "text") throw new Error("SQLite createdAt helper failed");
if (sqliteTableDefinition.updatedAt.getSQLType() !== "text") throw new Error("SQLite updatedAt helper failed");
if (sqliteTableDefinition.deletedAt.getSQLType() !== "text" || sqliteTableDefinition.deletedAt.notNull || sqliteTableDefinition.deletedAt.hasDefault) throw new Error("sqlite deletedAt helper failed");
if (typeof sqliteTableDefinition.id.defaultFn?.() !== "string") throw new Error("SQLite UUID default failed");

const mysqlTableDefinition = mysqlTable("users", { ...mysqlId(), ...mysqlTimestamps(), ...mysqlDeletedAt() });
const mysqlUuidTable = mysqlTable("uuid_users", { ...mysqlId("uuid") });
if (mysql.deletedAt !== mysqlDeletedAt || mysql.id !== mysqlId || mysql.createdAt !== mysqlCreatedAt || mysql.timestamps !== mysqlTimestamps || mysql.updatedAt !== mysqlUpdatedAt) throw new Error("MySQL root exports do not match subpath exports");
if (mysqlTableDefinition.id.getSQLType() !== "int") throw new Error("MySQL id helper failed");
if (mysqlTableDefinition.createdAt.getSQLType() !== "datetime(3)" || mysqlTableDefinition.updatedAt.getSQLType() !== "datetime(3)") throw new Error("MySQL timestamps helper failed");
if (mysqlTableDefinition.deletedAt.getSQLType() !== "datetime(3)" || mysqlTableDefinition.deletedAt.notNull || mysqlTableDefinition.deletedAt.hasDefault) throw new Error("MySQL deletedAt helper failed");
if (mysqlUuidTable.id.getSQLType() !== "char(36)" || typeof mysqlUuidTable.id.defaultFn?.() !== "string") throw new Error("MySQL UUID helper failed");

`;
  writeFileSync(join(temporaryDirectory, "smoke.mjs"), smokeTest);
  writeFileSync(join(temporaryDirectory, "smoke.ts"), smokeTest);
  writeFileSync(
    join(temporaryDirectory, "smoke.cjs"),
    `const { pgTable } = require("drizzle-orm/pg-core");
const { sqliteTable } = require("drizzle-orm/sqlite-core");
const { mysqlTable } = require("drizzle-orm/mysql-core");
const { createdAt: mysqlCreatedAt, deletedAt: mysqlDeletedAt, id: mysqlId, timestamps: mysqlTimestamps, updatedAt: mysqlUpdatedAt } = require("@setupless/drizzle/mysql");
const { pg, sqlite, mysql } = require("@setupless/drizzle");
const { createdAt: pgCreatedAt, deletedAt: pgDeletedAt, id: pgId, timestamps: pgTimestamps, updatedAt: pgUpdatedAt } = require("@setupless/drizzle/pg");
const { createdAt: sqliteCreatedAt, deletedAt: sqliteDeletedAt, id: sqliteId, timestamps: sqliteTimestamps, updatedAt: sqliteUpdatedAt } = require("@setupless/drizzle/sqlite");

const pgTableDefinition = pgTable("users", { ...pgId(), ...pgTimestamps(), ...pgDeletedAt() });
const sqliteTableDefinition = sqliteTable("users", { ...sqliteId("uuid"), ...sqliteTimestamps(), ...sqliteDeletedAt() });

if (pg.deletedAt !== pgDeletedAt || pg.id !== pgId || pg.createdAt !== pgCreatedAt || pg.timestamps !== pgTimestamps || pg.updatedAt !== pgUpdatedAt) throw new Error("PostgreSQL root exports do not match subpath exports");
if (sqlite.deletedAt !== sqliteDeletedAt || sqlite.id !== sqliteId || sqlite.createdAt !== sqliteCreatedAt || sqlite.timestamps !== sqliteTimestamps || sqlite.updatedAt !== sqliteUpdatedAt) throw new Error("SQLite root exports do not match subpath exports");
if (pgTableDefinition.id.getSQLType() !== "integer") throw new Error("PostgreSQL helper failed");
if (pgTableDefinition.createdAt.getSQLType() !== "timestamp") throw new Error("PostgreSQL createdAt helper failed");
if (pgTableDefinition.updatedAt.getSQLType() !== "timestamp") throw new Error("PostgreSQL updatedAt helper failed");
if (pgTableDefinition.deletedAt.getSQLType() !== "timestamp" || pgTableDefinition.deletedAt.notNull || pgTableDefinition.deletedAt.hasDefault) throw new Error("pg deletedAt helper failed");
if (sqliteTableDefinition.id.getSQLType() !== "text") throw new Error("SQLite helper failed");
if (sqliteTableDefinition.createdAt.getSQLType() !== "text") throw new Error("SQLite createdAt helper failed");
if (sqliteTableDefinition.updatedAt.getSQLType() !== "text") throw new Error("SQLite updatedAt helper failed");
if (sqliteTableDefinition.deletedAt.getSQLType() !== "text" || sqliteTableDefinition.deletedAt.notNull || sqliteTableDefinition.deletedAt.hasDefault) throw new Error("sqlite deletedAt helper failed");
if (typeof sqliteTableDefinition.id.defaultFn?.() !== "string") throw new Error("SQLite UUID default failed");

const mysqlTableDefinition = mysqlTable("users", { ...mysqlId(), ...mysqlTimestamps(), ...mysqlDeletedAt() });
const mysqlUuidTable = mysqlTable("uuid_users", { ...mysqlId("uuid") });
if (mysql.deletedAt !== mysqlDeletedAt || mysql.id !== mysqlId || mysql.createdAt !== mysqlCreatedAt || mysql.timestamps !== mysqlTimestamps || mysql.updatedAt !== mysqlUpdatedAt) throw new Error("MySQL root exports do not match subpath exports");
if (mysqlTableDefinition.id.getSQLType() !== "int") throw new Error("MySQL id helper failed");
if (mysqlTableDefinition.createdAt.getSQLType() !== "datetime(3)" || mysqlTableDefinition.updatedAt.getSQLType() !== "datetime(3)") throw new Error("MySQL timestamps helper failed");
if (mysqlTableDefinition.deletedAt.getSQLType() !== "datetime(3)" || mysqlTableDefinition.deletedAt.notNull || mysqlTableDefinition.deletedAt.hasDefault) throw new Error("MySQL deletedAt helper failed");
if (mysqlUuidTable.id.getSQLType() !== "char(36)" || typeof mysqlUuidTable.id.defaultFn?.() !== "string") throw new Error("MySQL UUID helper failed");

`,
  );

  run("node", ["smoke.mjs"], temporaryDirectory);
  run("node", ["smoke.cjs"], temporaryDirectory);
  run("bun", ["smoke.mjs"], temporaryDirectory);
  run("bun", ["smoke.cjs"], temporaryDirectory);
  run(
    "npx",
    [
      "--no-install",
      "tsc",
      "--noEmit",
      "--module",
      "NodeNext",
      "--moduleResolution",
      "NodeNext",
      "--target",
      "ES2022",
      "--skipLibCheck",
      "smoke.ts",
    ],
    temporaryDirectory,
  );
} finally {
  if (archivePath) rmSync(archivePath, { force: true });
  rmSync(temporaryDirectory, { force: true, recursive: true });
}
