import {
  conceptDepths,
  conceptDomains,
  conceptStatuses,
  interactionKinds,
  type ConceptMetadata,
  type KnowledgeNode
} from "./types.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isOneOf<T extends readonly string[]>(
  value: unknown,
  allowed: T
): value is T[number] {
  return typeof value === "string" && allowed.includes(value);
}

export function assertConceptMetadata(
  value: unknown
): asserts value is ConceptMetadata {
  if (!isRecord(value)) throw new Error("Concept metadata must be an object.");

  if (typeof value.id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.id)) {
    throw new Error("Concept id must be lowercase kebab-case.");
  }

  if (typeof value.title !== "string" || value.title.trim().length === 0) {
    throw new Error(`Concept ${value.id}: title is required.`);
  }

  if (typeof value.summary !== "string" || value.summary.trim().length === 0) {
    throw new Error(`Concept ${value.id}: summary is required.`);
  }

  if (!isOneOf(value.domain, conceptDomains)) throw new Error(`Concept ${value.id}: invalid domain.`);
  if (!isOneOf(value.depth, conceptDepths)) throw new Error(`Concept ${value.id}: invalid depth.`);
  if (!isOneOf(value.status, conceptStatuses)) throw new Error(`Concept ${value.id}: invalid status.`);
  if (!isStringArray(value.prerequisites)) throw new Error(`Concept ${value.id}: prerequisites must be a string array.`);
  if (!isStringArray(value.tags)) throw new Error(`Concept ${value.id}: tags must be a string array.`);

  if (!isRecord(value.interaction) || !isOneOf(value.interaction.kind, interactionKinds)) {
    throw new Error(`Concept ${value.id}: invalid interaction.`);
  }

  if (value.interaction.component !== undefined && typeof value.interaction.component !== "string") {
    throw new Error(`Concept ${value.id}: interaction.component must be a string.`);
  }
}

export function assertConceptCatalog(
  value: unknown
): asserts value is ConceptMetadata[] {
  if (!Array.isArray(value)) throw new Error("Concept catalog must be an array.");
  for (const concept of value) assertConceptMetadata(concept);
}

function validateReferences(concepts: ConceptMetadata[]): Map<string, ConceptMetadata> {
  const byId = new Map<string, ConceptMetadata>();

  for (const concept of concepts) {
    if (byId.has(concept.id)) throw new Error(`Duplicate concept id: ${concept.id}`);
    byId.set(concept.id, concept);
  }

  for (const concept of concepts) {
    for (const prerequisite of concept.prerequisites) {
      if (prerequisite === concept.id) throw new Error(`Concept ${concept.id} cannot depend on itself.`);
      if (!byId.has(prerequisite)) {
        throw new Error(`Concept ${concept.id} references missing prerequisite ${prerequisite}.`);
      }
    }
  }

  return byId;
}

export function topologicalOrder(concepts: ConceptMetadata[]): string[] {
  assertConceptCatalog(concepts);
  validateReferences(concepts);

  const indegree = new Map<string, number>();
  const dependents = new Map<string, string[]>();

  for (const concept of concepts) {
    indegree.set(concept.id, concept.prerequisites.length);
    dependents.set(concept.id, []);
  }

  for (const concept of concepts) {
    for (const prerequisite of concept.prerequisites) {
      dependents.get(prerequisite)?.push(concept.id);
    }
  }

  const ready = [...indegree.entries()]
    .filter(([, degree]) => degree === 0)
    .map(([id]) => id)
    .sort();

  const order: string[] = [];

  while (ready.length > 0) {
    const current = ready.shift();
    if (current === undefined) break;
    order.push(current);

    for (const dependent of dependents.get(current) ?? []) {
      const nextDegree = (indegree.get(dependent) ?? 0) - 1;
      indegree.set(dependent, nextDegree);
      if (nextDegree === 0) {
        ready.push(dependent);
        ready.sort();
      }
    }
  }

  if (order.length !== concepts.length) {
    throw new Error("Concept prerequisite graph contains a cycle.");
  }

  return order;
}

export function buildKnowledgeGraph(
  concepts: ConceptMetadata[]
): KnowledgeNode[] {
  const order = topologicalOrder(concepts);
  const byId = validateReferences(concepts);
  const unlocks = new Map<string, string[]>();

  for (const id of order) unlocks.set(id, []);

  for (const concept of concepts) {
    for (const prerequisite of concept.prerequisites) {
      unlocks.get(prerequisite)?.push(concept.id);
    }
  }

  return order.map((id) => {
    const concept = byId.get(id);
    if (concept === undefined) throw new Error(`Missing concept after graph validation: ${id}`);
    return { ...concept, unlocks: [...(unlocks.get(id) ?? [])].sort() };
  });
}

export function getReadyConcepts(
  concepts: ConceptMetadata[],
  masteredIds: Iterable<string>
): ConceptMetadata[] {
  topologicalOrder(concepts);
  const mastered = new Set(masteredIds);

  return concepts.filter(
    (concept) =>
      !mastered.has(concept.id) &&
      concept.prerequisites.every((prerequisite) => mastered.has(prerequisite))
  );
}
