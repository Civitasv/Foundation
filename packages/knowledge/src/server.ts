import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { assertConceptCatalog, topologicalOrder } from "./graph";
import type { ConceptMetadata } from "./types";

export async function loadConceptCatalog(
  contentRoot: string
): Promise<ConceptMetadata[]> {
  const entries = await readdir(contentRoot, { withFileTypes: true });
  const directories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const unknownConcepts: unknown[] = await Promise.all(
    directories.map(async (directory) => {
      const metadataPath = path.join(contentRoot, directory, "concept.json");
      const raw = await readFile(metadataPath, "utf8");
      return JSON.parse(raw) as unknown;
    })
  );

  assertConceptCatalog(unknownConcepts);
  const order = topologicalOrder(unknownConcepts);
  const byId = new Map(unknownConcepts.map((concept) => [concept.id, concept]));

  return order.map((id) => {
    const concept = byId.get(id);
    if (concept === undefined) throw new Error(`Concept disappeared while loading catalog: ${id}`);
    return concept;
  });
}
