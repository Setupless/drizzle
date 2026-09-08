import { execFileSync } from "node:child_process";
import { rmSync } from "node:fs";
import { resolve } from "node:path";

const packageRoot = resolve(import.meta.dirname, "..");

rmSync(resolve(packageRoot, "dist"), { force: true, recursive: true });
execFileSync("bun", ["x", "tsc", "--project", "tsconfig.build.json"], {
  cwd: packageRoot,
  stdio: "inherit",
});
