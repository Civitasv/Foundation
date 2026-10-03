import { buildKnowledgeGraph } from "./graph";
import type { ConceptMetadata } from "./types";

export interface LessonHeading {
  depth: 2 | 3;
  title: string;
  id: string;
}

export interface ConceptNeighbor {
  id: string;
  title: ConceptMetadata["title"];
}

export interface ConceptNeighbors {
  previous?: ConceptNeighbor;
  next?: ConceptNeighbor;
}

export function slugifyHeading(value: string): string {
  const slug = value
    .normalize("NFKC")
    .toLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "section";
}

export function stripLeadingTitle(source: string): string {
  return source.replace(/^\uFEFF?#\s+[^\n]+\n+/, "").trimStart();
}

export function extractLessonHeadings(source: string): LessonHeading[] {
  const headings: LessonHeading[] = [];
  let inFence = false;

  for (const line of source.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }

    if (inFence) continue;

    const match = /^(##|###)\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const title = match[2];
    if (title === undefined) continue;

    headings.push({
      depth: match[1] === "##" ? 2 : 3,
      title,
      id: slugifyHeading(title)
    });
  }

  return headings;
}

export function getConceptNeighbors(
  concepts: ConceptMetadata[],
  id: string
): ConceptNeighbors {
  const graph = buildKnowledgeGraph(concepts);
  const byId = new Map(graph.map((concept) => [concept.id, concept]));
  const current = byId.get(id);

  if (!current) return {};

  const previousId = current.prerequisites[0];
  const nextId = current.unlocks[0];

  const previous = previousId ? byId.get(previousId) : undefined;
  const next = nextId ? byId.get(nextId) : undefined;

  return {
    ...(previous ? { previous: { id: previous.id, title: previous.title } } : {}),
    ...(next ? { next: { id: next.id, title: next.title } } : {})
  };
}
