import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const domains = new Set(["foundations", "models", "agents", "systems", "production"]);
const [id, chineseTitle, englishTitle, domain] = process.argv.slice(2);

if (!id || !chineseTitle || !englishTitle || !domain) {
  console.error('Usage: pnpm concept:new -- <id> "<中文标题>" "<English title>" <domain>');
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
  title: {
    "zh-CN": chineseTitle,
    en: englishTitle
  },
  summary: {
    "zh-CN": `TODO：解释为什么需要理解「${chineseTitle}」。`,
    en: `TODO: explain why ${englishTitle} matters.`
  },
  domain,
  depth: "awareness",
  status: "seed",
  prerequisites: [],
  interaction: { kind: "none" },
  tags: []
};

const chineseLesson = `# ${chineseTitle}

## 为什么需要它

TODO

## 直觉

TODO

## 与 Agent 的关系

TODO
`;

const englishLesson = `# ${englishTitle}

## Why it exists

TODO

## Intuition

TODO

## Connection to agents

TODO
`;

await Promise.all([
  writeFile(path.join(directory, "concept.json"), `${JSON.stringify(metadata, null, 2)}\n`, "utf8"),
  writeFile(path.join(directory, "index.mdx"), chineseLesson, "utf8"),
  writeFile(path.join(directory, "index.en.mdx"), englishLesson, "utf8")
]);

console.log(`Created bilingual concept content/concepts/${id}`);
