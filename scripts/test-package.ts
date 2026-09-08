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
import { id as pgId } from "@setupless/drizzle/pg";
import { id as sqliteId } from "@setupless/drizzle/sqlite";

const pgTableDefinition = pgTable("users", { ...pgId() });
const sqliteTableDefinition = sqliteTable("users", { ...sqliteId("uuid") });

if (pg.id !== pgId || sqlite.id !== sqliteId) throw new Error("Root exports do not match subpath exports");
if (pgTableDefinition.id.getSQLType() !== "integer") throw new Error("PostgreSQL helper failed");
if (sqliteTableDefinition.id.getSQLType() !== "text") throw new Error("SQLite helper failed");
if (typeof sqliteTableDefinition.id.defaultFn?.() !== "string") throw new Error("SQLite UUID default failed");
`;
  writeFileSync(join(temporaryDirectory, "smoke.mjs"), smokeTest);
  writeFileSync(join(temporaryDirectory, "smoke.ts"), smokeTest);

  run("node", ["smoke.mjs"], temporaryDirectory);
  run("bun", ["smoke.mjs"], temporaryDirectory);
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
