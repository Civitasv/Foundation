"use client";

import { useEffect, useState } from "react";
import type { ConceptMetadata, FoundationLocale } from "@foundation/knowledge";
import { KnowledgeExplorer } from "../knowledge-explorer";

type Dataset = "demo" | "worst" | "empty" | "one" | "forty" | "forty-one" | "large";
const datasets: ReadonlyArray<readonly [Dataset, string]> = [
  ["demo", "Demo data"], ["worst", "Worst case"], ["empty", "Empty"],
  ["one", "One"], ["forty", "40 rows"], ["forty-one", "41 rows"], ["large", "1,000 rows"]
];

function worstCase(concepts: ConceptMetadata[]): ConceptMetadata[] {
  const titles = [
    ["长时运行 Agent 的上下文管理、失败恢复与工具执行边界", "Context Management, Failure Recovery, and Tool Execution Boundaries for Long-running Agents"],
    ["KVCacheMemoryManagementAndRecomputation", "KVCacheMemoryManagementAndRecomputation"],
    ["Q", "Q"],
    ["向量 👩🏽‍💻 与 Đặng Thị Ngọc Hân 的坐标表示", "Vectors 👩🏽‍💻 and Đặng Thị Ngọc Hân’s Coordinates"],
    ["<script>alert(1)</script> 与 **强调**", "<script>alert(1)</script> and **emphasis**"]
  ];
  return concepts.map((concept, index) => ({
    ...concept,
    title: { "zh-CN": titles[index % titles.length]?.[0] ?? "Q", en: titles[index % titles.length]?.[1] ?? "Q" },
    summary: {
      "zh-CN": "当任务跨越多个工具与多次执行时，需要保留约束、观察与错误来源。参考地址：https://example.com/agent-engineering/runtime/context-construction-and-failure-recovery。".repeat(8),
      en: "A long-running task retains constraints, observations, and error sources across multiple tools. Source: https://example.com/agent-engineering/runtime/context-construction-and-failure-recovery. ".repeat(8)
    },
    interaction: { kind: "none" },
    prerequisites: index === 0 ? concepts.slice(1).map(item => item.id) : []
  }));
}

export function CatalogStressHarness({ concepts, locale }: Readonly<{ concepts: ConceptMetadata[]; locale: FoundationLocale }>) {
  const [enabled, setEnabled] = useState(false);
  const [dataset, setDataset] = useState<Dataset>("demo");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEnabled(params.has("stress"));
    if (!params.has("stress")) return;
    const saved = params.get("data");
    if (datasets.some(([key]) => key === saved)) setDataset(saved as Dataset);
    if (params.get("text") === "large") document.documentElement.style.fontSize = "200%";
    return () => { document.documentElement.style.removeProperty("font-size"); };
  }, []);

  const data = dataset === "worst" ? worstCase(concepts)
    : dataset === "empty" ? []
    : dataset === "one" ? concepts.slice(0, 1).map(concept => ({ ...concept, prerequisites: [] }))
    : ["large", "forty", "forty-one"].includes(dataset) ? Array.from({ length: dataset === "forty" ? 40 : dataset === "forty-one" ? 41 : 1000 }, (_, index) => ({
      ...concepts[index % concepts.length]!,
      id: `catalog-topic-${index}`, prerequisites: [],
      title: { "zh-CN": `Agent 运行时案例 ${index + 1}`, en: `Agent Runtime Case ${index + 1}` }
    })) : concepts;

  function select(next: Dataset) {
    setDataset(next);
    const url = new URL(window.location.href);
    url.searchParams.set("data", next);
    window.history.replaceState(null, "", url);
  }

  return <>
    <KnowledgeExplorer key={dataset} concepts={data} locale={locale} />
    {enabled ? <div className="catalog-stress-toggle" role="group" aria-label="Catalog test data">
      {datasets.map(([key, label]) => <button key={key} type="button" aria-pressed={dataset === key} onClick={() => select(key)}>{label}</button>)}
    </div> : null}
  </>;
}
