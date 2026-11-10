import { build } from "esbuild";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../../", import.meta.url));
const require = createRequire(import.meta.url);

/** Compile the actual Next .js/JSX source in memory; external packages share the test's React. */
export async function loadJsx(relativePath, replacements = {}) {
  const result = await build({
    entryPoints: [path.resolve(projectRoot, relativePath)],
    bundle: true,
    write: false,
    platform: "node",
    format: "cjs",
    supported: { "dynamic-import": false },
    jsx: "automatic",
    loader: { ".js": "jsx" },
    packages: "external",
    logLevel: "silent",
  });
  const compiledModule = { exports: {} };
  const scopedRequire = (name) => Object.hasOwn(replacements, name) ? replacements[name] : require(name);
  const evaluate = new Function("require", "module", "exports", result.outputFiles[0].text);
  evaluate(scopedRequire, compiledModule, compiledModule.exports);
  return compiledModule.exports;
}
