import { describe, expect, it } from "vitest";
import {
  extractLessonHeadings,
  getConceptNeighbors,
  slugifyHeading,
  stripLeadingTitle
} from "./lesson";
import type { ConceptMetadata } from "./types";

function concept(
  id: string,
  prerequisites: string[] = []
): ConceptMetadata {
  return {
    id,
    title: { "zh-CN": id, en: id },
    summary: { "zh-CN": id, en: id },
    domain: "foundations",
    depth: "understanding",
    status: "seed",
    prerequisites,
    interaction: { kind: "none" },
    tags: []
  };
}

describe("lesson utilities", () => {
  it("creates stable unicode heading slugs", () => {
    expect(slugifyHeading("为什么需要它")).toBe("为什么需要它");
    expect(slugifyHeading("Connection to Agent Engineering")).toBe(
      "connection-to-agent-engineering"
    );
  });

  it("extracts h2 and h3 headings while ignoring code fences", () => {
    const source = `# 向量

## 为什么需要它

\`\`\`md
## not-a-heading
\`\`\`

### 坐标与长度
`;

    expect(extractLessonHeadings(source)).toEqual([
      { depth: 2, title: "为什么需要它", id: "为什么需要它" },
      { depth: 3, title: "坐标与长度", id: "坐标与长度" }
    ]);
  });

  it("removes the source h1 before chapter rendering", () => {
    expect(stripLeadingTitle("# 向量\n\n## 直觉\n")).toBe("## 直觉\n");
  });

  it("derives chapter neighbors from graph relationships", () => {
    const concepts = [
      concept("vector"),
      concept("dot-product", ["vector"]),
      concept("matrix", ["vector"])
    ];

    const neighbors = getConceptNeighbors(concepts, "vector");

    expect(neighbors.previous).toBeUndefined();
    expect(neighbors.next?.id).toBe("dot-product");
  });
});
