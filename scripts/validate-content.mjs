import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = path.resolve(process.cwd(), "content", "concepts");
const domains = new Set(["foundations", "models", "agents", "systems", "production"]);
const depths = new Set(["awareness", "understanding", "implementation", "deep-dive"]);
const statuses = new Set(["seed", "draft", "review", "complete"]);
const interactions = new Set(["none", "visualizer", "simulator", "lab"]);

function fail(message) { throw new Error(message); }

function assertStringArray(value, field, id) {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    fail(`${id}: ${field} must be a string array.`);
  }
}

function validateShape(value, directory) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail(`${directory}: concept.json must contain an object.`);
  }

  const id = value.id;
  if (typeof id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) fail(`${directory}: id must be lowercase kebab-case.`);
  if (id !== directory) fail(`${id}: directory name must match concept id.`);
  if (typeof value.title !== "string" || value.title.trim() === "") fail(`${id}: title is required.`);
  if (typeof value.summary !== "string" || value.summary.trim() === "") fail(`${id}: summary is required.`);
  if (!domains.has(value.domain)) fail(`${id}: invalid domain.`);
  if (!depths.has(value.depth)) fail(`${id}: invalid depth.`);
  if (!statuses.has(value.status)) fail(`${id}: invalid status.`);
  assertStringArray(value.prerequisites, "prerequisites", id);
  assertStringArray(value.tags, "tags", id);

  if (typeof value.interaction !== "object" || value.interaction === null || !interactions.has(value.interaction.kind)) {
    fail(`${id}: invalid interaction.`);
  }

  if (value.interaction.component !== undefined && typeof value.interaction.component !== "string") {
    fail(`${id}: interaction.component must be a string.`);
  }
}

const entries = (await readdir(root, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const concepts = [];

for (const directory of entries) {
  const base = path.join(root, directory);
  const raw = await readFile(path.join(base, "concept.json"), "utf8");
  const concept = JSON.parse(raw);
  validateShape(concept, directory);
  await access(path.join(base, "index.mdx"));
  concepts.push(concept);
}

const byId = new Map();

for (const concept of concepts) {
  if (byId.has(concept.id)) fail(`Duplicate concept id: ${concept.id}`);
  byId.set(concept.id, concept);
}

for (const concept of concepts) {
  for (const prerequisite of concept.prerequisites) {
    if (prerequisite === concept.id) fail(`${concept.id}: self-dependency is not allowed.`);
    if (!byId.has(prerequisite)) fail(`${concept.id}: missing prerequisite ${prerequisite}.`);
  }
}

const state = new Map();

function visit(id, trail = []) {
  const mark = state.get(id);
  if (mark === "done") return;
  if (mark === "visiting") fail(`Dependency cycle: ${[...trail, id].join(" -> ")}`);

  state.set(id, "visiting");
  const concept = byId.get(id);

  for (const prerequisite of concept.prerequisites) {
    visit(prerequisite, [...trail, id]);
  }

  state.set(id, "done");
}

for (const concept of concepts) visit(concept.id);

console.log(`Validated ${concepts.length} concepts; prerequisite graph is acyclic.`);
