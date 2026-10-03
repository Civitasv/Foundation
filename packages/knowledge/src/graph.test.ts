import { describe, expect, it } from "vitest";
import {
  buildKnowledgeGraph,
  getReadyConcepts,
  topologicalOrder
} from "./graph";
import type { ConceptMetadata } from "./types";

function concept(id: string, prerequisites: string[] = []): ConceptMetadata {
  return {
    id,
    title: {
      "zh-CN": id,
      en: id
    },
    summary: {
      "zh-CN": `学习 ${id}`,
      en: `Learn ${id}`
    },
    domain: "foundations",
    depth: "understanding",
    status: "seed",
    prerequisites,
    interaction: { kind: "none" },
    tags: []
  };
}

describe("knowledge graph", () => {
  it("orders prerequisites before dependent concepts", () => {
    const concepts = [
      concept("attention", ["softmax"]),
      concept("softmax", ["probability"]),
      concept("probability")
    ];

    expect(topologicalOrder(concepts)).toEqual(["probability", "softmax", "attention"]);
  });

  it("derives unlock edges instead of storing them", () => {
    const graph = buildKnowledgeGraph([
      concept("vector"),
      concept("dot-product", ["vector"])
    ]);

    expect(graph.find((node) => node.id === "vector")?.unlocks).toEqual(["dot-product"]);
  });

  it("rejects dependency cycles", () => {
    const concepts = [concept("a", ["b"]), concept("b", ["a"])];
    expect(() => topologicalOrder(concepts)).toThrow(/cycle/i);
  });

  it("finds concepts unlocked by mastered prerequisites", () => {
    const concepts = [
      concept("vector"),
      concept("matrix", ["vector"]),
      concept("attention", ["matrix"])
    ];

    expect(getReadyConcepts(concepts, ["vector"]).map((item) => item.id)).toEqual(["matrix"]);
  });
});
