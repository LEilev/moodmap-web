import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const cwd = fileURLToPath(new URL("../../", import.meta.url));
const env = {
  ...process.env,
  NEXT_TELEMETRY_DISABLED: "1",
  // Test-only: the ordinary `build` and `check` commands retain their configured ID.
  NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-MOODMAPTEST",
};

function run(args) {
  const result = spawnSync(process.execPath, args, { cwd, env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}

run(["scripts/sync-public-content.mjs", "--check"]);
run([require.resolve("next/dist/bin/next"), "build"]);
run([require.resolve("@playwright/test/cli"), "test", ...process.argv.slice(2)]);
