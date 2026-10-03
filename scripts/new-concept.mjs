import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const domains = new Set(["foundations", "models", "agents", "systems", "production"]);
const [id, title, domain] = process.argv.slice(2);

if (!id || !title || !domain) {
  console.error('Usage: pnpm concept:new -- <id> "<title>" <domain>');
  process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
  console.error("Concept id must be lowercase kebab-case.");
  process.exit(1);
}

if (!domains.has(domain)) {
  console.error(`Domain must be one of: ${[...domains].join(", ")}`);
  process.exit(1);
}

const directory = path.resolve(process.cwd(), "content", "concepts", id);

try {
  await access(directory);
  console.error(`Concept already exists: ${id}`);
  process.exit(1);
} catch {
  // Expected for a new concept.
}

await mkdir(directory, { recursive: true });

const metadata = {
  id,
  title,
  summary: `TODO: explain why ${title} matters.`,
  domain,
  depth: "awareness",
  status: "seed",
  prerequisites: [],
  interaction: { kind: "none" },
  tags: []
};

const lesson = `# ${title}

## Why it exists

TODO

## Intuition

TODO

## Connection to agents

TODO
`;

await Promise.all([
  writeFile(path.join(directory, "concept.json"), `${JSON.stringify(metadata, null, 2)}\n`, "utf8"),
  writeFile(path.join(directory, "index.mdx"), lesson, "utf8")
]);

console.log(`Created content/concepts/${id}`);
