import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const packageRoot = resolve(import.meta.dirname, "..");

const distributionDirectory = resolve(packageRoot, "dist");
const commonJsDirectory = resolve(distributionDirectory, "cjs");

function compile(configuration: string) {
  execFileSync("bun", ["x", "tsc", "--project", configuration], {
    cwd: packageRoot,
    stdio: "inherit",
  });
}

rmSync(distributionDirectory, { force: true, recursive: true });
compile("tsconfig.build.json");
compile("tsconfig.cjs.json");
mkdirSync(commonJsDirectory, { recursive: true });
writeFileSync(
  resolve(commonJsDirectory, "package.json"),
  `${JSON.stringify({ type: "commonjs" })}\n`,
);
