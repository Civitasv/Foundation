import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const course = path.join(root, "content/courses/machine-learning");
const checkout = path.join(root, ".cache/edtrace");
const frontend = path.join(checkout, "frontend");
const destination = path.join(root, "apps/web/out/courses/machine-learning/presentation");
const revision = "d14a5f525de0aca2bd249ca6c36f1af252cddab2";
const python = process.env.EDTRACE_PYTHON || "python3";
const pagesBasePath = (process.env.PAGES_BASE_PATH || "").replace(/\/+$/, "");
const basename = `${pagesBasePath}/courses/machine-learning/presentation/`;

function run(command, args, { cwd = root, quiet = false, env = process.env } = {}) {
  const result = spawnSync(command, args, {
    cwd,
    env,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    stdio: quiet ? "pipe" : "inherit"
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    if (quiet) {
      process.stdout.write(result.stdout || "");
      process.stderr.write(result.stderr || "");
    }
    throw new Error(`${command} failed (${result.status ?? result.signal}).`);
  }
  return result.stdout?.trim();
}

if (pagesBasePath && !pagesBasePath.startsWith("/")) {
  throw new Error("PAGES_BASE_PATH must be an absolute URL path, such as /Foundation.");
}

const courseMetadata = JSON.parse(readFileSync(path.join(course, "course.json"), "utf8"));
const moduleName = courseMetadata.presentationTrace;
if (typeof moduleName !== "string" || !/^[a-z][a-z0-9_]*$/.test(moduleName) || !existsSync(path.join(course, `${moduleName}.py`))) {
  throw new Error("The machine learning course must reference an executable presentation module.");
}

run(python, ["-m", "unittest", "discover", "-s", ".", "-p", "test_*.py"], { cwd: course });
run(python, ["-m", "edtrace.execute", "-m", moduleName], { cwd: course, quiet: true });
const trace = JSON.parse(readFileSync(path.join(course, "var/traces", `${moduleName}.json`), "utf8"));
if (!trace.steps?.length) throw new Error(`${moduleName} produced an empty trace.`);
console.log(`${moduleName}: ${trace.steps.length} trace steps`);

if (!existsSync(path.join(checkout, ".git"))) {
  mkdirSync(path.dirname(checkout), { recursive: true });
  run("git", ["clone", "https://github.com/percyliang/edtrace.git", checkout]);
}
if (run("git", ["rev-parse", "HEAD"], { cwd: checkout, quiet: true }) !== revision) {
  run("git", ["fetch", "--depth", "1", "origin", revision], { cwd: checkout });
  run("git", ["checkout", "--detach", revision], { cwd: checkout });
}

run("npm", ["ci", "--no-audit", "--no-fund"], { cwd: frontend });
const publicDir = path.join(frontend, "public");
mkdirSync(publicDir, { recursive: true });
for (const name of ["var", "images"]) {
  // Replace the upstream repository's relative symlinks with this course's files.
  rmSync(path.join(publicDir, name), { recursive: true, force: true });
}
mkdirSync(path.join(publicDir, "var/traces"), { recursive: true });
cpSync(path.join(course, "var/traces", `${moduleName}.json`), path.join(publicDir, "var/traces", `${moduleName}.json`));
for (const name of ["var/files", "images"]) {
  const source = path.join(course, name);
  if (existsSync(source)) cpSync(source, path.join(publicDir, name), { recursive: true });
}

run("npm", ["run", "build", "--", "--emptyOutDir"], {
  cwd: frontend,
  env: { ...process.env, VITE_EDTRACE_BASE_DIR: basename, VITE_EDTRACE_DIST_DIR: destination }
});
if (!existsSync(path.join(destination, "index.html"))) throw new Error("edtrace did not produce index.html.");
cpSync(path.join(root, "apps/web/styles/edtrace.css"), path.join(destination, "foundation.css"));
const playerHtml = readFileSync(path.join(destination, "index.html"), "utf8");
writeFileSync(path.join(destination, "index.html"), playerHtml
  .replace('<html lang="en">', '<html lang="zh-CN">')
  .replace("</head>", '<link rel="stylesheet" href="./foundation.css" /></head>'));
cpSync(path.join(checkout, "LICENSE"), path.join(destination, "LICENSE.edtrace"));
if (!existsSync(path.join(destination, "var/traces", `${moduleName}.json`))) {
  throw new Error(`The exported presentation is missing ${moduleName}.json.`);
}
console.log(`Built edtrace presentation at ${basename}?trace=${moduleName}`);
