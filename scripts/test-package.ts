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
import { pg, sqlite } from "@setupless/drizzle";
import { createdAt as pgCreatedAt, id as pgId, timestamps as pgTimestamps, updatedAt as pgUpdatedAt } from "@setupless/drizzle/pg";
import { createdAt as sqliteCreatedAt, id as sqliteId, timestamps as sqliteTimestamps, updatedAt as sqliteUpdatedAt } from "@setupless/drizzle/sqlite";

const pgTableDefinition = pgTable("users", { ...pgId(), ...pgTimestamps() });
const sqliteTableDefinition = sqliteTable("users", { ...sqliteId("uuid"), ...sqliteTimestamps() });

if (pg.id !== pgId || pg.createdAt !== pgCreatedAt || pg.timestamps !== pgTimestamps || pg.updatedAt !== pgUpdatedAt) throw new Error("PostgreSQL root exports do not match subpath exports");
if (sqlite.id !== sqliteId || sqlite.createdAt !== sqliteCreatedAt || sqlite.timestamps !== sqliteTimestamps || sqlite.updatedAt !== sqliteUpdatedAt) throw new Error("SQLite root exports do not match subpath exports");
if (pgTableDefinition.id.getSQLType() !== "integer") throw new Error("PostgreSQL helper failed");
if (pgTableDefinition.createdAt.getSQLType() !== "timestamp") throw new Error("PostgreSQL createdAt helper failed");
if (pgTableDefinition.updatedAt.getSQLType() !== "timestamp") throw new Error("PostgreSQL updatedAt helper failed");
if (sqliteTableDefinition.id.getSQLType() !== "text") throw new Error("SQLite helper failed");
if (sqliteTableDefinition.createdAt.getSQLType() !== "text") throw new Error("SQLite createdAt helper failed");
if (sqliteTableDefinition.updatedAt.getSQLType() !== "text") throw new Error("SQLite updatedAt helper failed");
if (typeof sqliteTableDefinition.id.defaultFn?.() !== "string") throw new Error("SQLite UUID default failed");
`;
  writeFileSync(join(temporaryDirectory, "smoke.mjs"), smokeTest);
  writeFileSync(join(temporaryDirectory, "smoke.ts"), smokeTest);
  writeFileSync(
    join(temporaryDirectory, "smoke.cjs"),
    `const { pgTable } = require("drizzle-orm/pg-core");
const { sqliteTable } = require("drizzle-orm/sqlite-core");
const { pg, sqlite } = require("@setupless/drizzle");
const { createdAt: pgCreatedAt, id: pgId, timestamps: pgTimestamps, updatedAt: pgUpdatedAt } = require("@setupless/drizzle/pg");
const { createdAt: sqliteCreatedAt, id: sqliteId, timestamps: sqliteTimestamps, updatedAt: sqliteUpdatedAt } = require("@setupless/drizzle/sqlite");

const pgTableDefinition = pgTable("users", { ...pgId(), ...pgTimestamps() });
const sqliteTableDefinition = sqliteTable("users", { ...sqliteId("uuid"), ...sqliteTimestamps() });

if (pg.id !== pgId || pg.createdAt !== pgCreatedAt || pg.timestamps !== pgTimestamps || pg.updatedAt !== pgUpdatedAt) throw new Error("PostgreSQL root exports do not match subpath exports");
if (sqlite.id !== sqliteId || sqlite.createdAt !== sqliteCreatedAt || sqlite.timestamps !== sqliteTimestamps || sqlite.updatedAt !== sqliteUpdatedAt) throw new Error("SQLite root exports do not match subpath exports");
if (pgTableDefinition.id.getSQLType() !== "integer") throw new Error("PostgreSQL helper failed");
if (pgTableDefinition.createdAt.getSQLType() !== "timestamp") throw new Error("PostgreSQL createdAt helper failed");
if (pgTableDefinition.updatedAt.getSQLType() !== "timestamp") throw new Error("PostgreSQL updatedAt helper failed");
if (sqliteTableDefinition.id.getSQLType() !== "text") throw new Error("SQLite helper failed");
if (sqliteTableDefinition.createdAt.getSQLType() !== "text") throw new Error("SQLite createdAt helper failed");
if (sqliteTableDefinition.updatedAt.getSQLType() !== "text") throw new Error("SQLite updatedAt helper failed");
if (typeof sqliteTableDefinition.id.defaultFn?.() !== "string") throw new Error("SQLite UUID default failed");
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
