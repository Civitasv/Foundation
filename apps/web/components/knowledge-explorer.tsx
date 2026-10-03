"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  localize,
  type ConceptDomain,
  type ConceptMetadata,
  type FoundationLocale
} from "@foundation/knowledge";

const domainLabels: Record<FoundationLocale, Record<ConceptDomain, string>> = {
  "zh-CN": {
    foundations: "基础",
    models: "模型",
    agents: "Agent",
    systems: "系统",
    production: "生产"
  },
  en: {
    foundations: "Foundations",
    models: "Models",
    agents: "Agents",
    systems: "Systems",
    production: "Production"
  }
};

const domainOrder: ConceptDomain[] = [
  "foundations",
  "models",
  "agents",
  "systems",
  "production"
];

const depthLabels: Record<FoundationLocale, Record<ConceptMetadata["depth"], string>> = {
  "zh-CN": {
    awareness: "了解",
    understanding: "理解",
    implementation: "实现",
    "deep-dive": "深入"
  },
  en: {
    awareness: "Awareness",
    understanding: "Understanding",
    implementation: "Implementation",
    "deep-dive": "Deep dive"
  }
};

const interactionLabels: Record<
  FoundationLocale,
  Record<ConceptMetadata["interaction"]["kind"], string>
> = {
  "zh-CN": {
    none: "无",
    visualizer: "可视化",
    simulator: "模拟器",
    lab: "实验"
  },
  en: {
    none: "None",
    visualizer: "Visualizer",
    simulator: "Simulator",
    lab: "Lab"
  }
};

const copy = {
  "zh-CN": {
    requires: "前置知识",
    unlocks: "接下来",
    interaction: "交互",
    none: "无",
    read: "阅读本章"
  },
  en: {
    requires: "Requires",
    unlocks: "Next",
    interaction: "Interaction",
    none: "None",
    read: "Read chapter"
  }
} satisfies Record<FoundationLocale, Record<string, string>>;

export function KnowledgeExplorer({
  concepts,
  locale
}: Readonly<{ concepts: ConceptMetadata[]; locale: FoundationLocale }>) {
  const [selectedId, setSelectedId] = useState(concepts[0]?.id ?? "");
  const text = copy[locale];
  const selected = concepts.find((concept) => concept.id === selectedId) ?? concepts[0];

  const byId = useMemo(
    () => new Map(concepts.map((concept) => [concept.id, concept])),
    [concepts]
  );

  if (!selected) return null;

  const prerequisites = selected.prerequisites
    .map((id) => byId.get(id))
    .filter((concept): concept is ConceptMetadata => concept !== undefined);

  const unlocks = concepts.filter((concept) =>
    concept.prerequisites.includes(selected.id)
  );

  const chapterHref =
    locale === "en"
      ? `/en/concepts/${selected.id}/`
      : `/concepts/${selected.id}/`;

  return (
    <div className="explorer">
      <div className="concept-browser">
        {domainOrder.map((domain) => {
          const nodes = concepts.filter((concept) => concept.domain === domain);
          if (nodes.length === 0) return null;

          return (
            <section className="concept-group" key={domain}>
              <h3>{domainLabels[locale][domain]}</h3>
              <div className="concept-list">
                {nodes.map((concept) => (
                  <button
                    className="concept-row"
                    data-active={concept.id === selected.id}
                    key={concept.id}
                    onClick={() => setSelectedId(concept.id)}
                    type="button"
                  >
                    <span>{localize(concept.title, locale)}</span>
                    <span aria-hidden="true">›</span>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <aside className="concept-detail" aria-live="polite">
        <div className="concept-meta">
          {domainLabels[locale][selected.domain]} · {depthLabels[locale][selected.depth]}
        </div>
        <h3>{localize(selected.title, locale)}</h3>
        <p className="concept-summary">{localize(selected.summary, locale)}</p>
        <Link className="concept-read-link" href={chapterHref}>
          {text.read} ›
        </Link>

        <dl className="concept-facts">
          <div>
            <dt>{text.requires}</dt>
            <dd>
              {prerequisites.length > 0 ? prerequisites.map((concept, index) => (
                <span key={concept.id}>
                  <button type="button" onClick={() => setSelectedId(concept.id)}>
                    {localize(concept.title, locale)}
                  </button>
                  {index < prerequisites.length - 1 ? "、" : ""}
                </span>
              )) : text.none}
            </dd>
          </div>

          <div>
            <dt>{text.unlocks}</dt>
            <dd>
              {unlocks.length > 0 ? unlocks.map((concept, index) => (
                <span key={concept.id}>
                  <button type="button" onClick={() => setSelectedId(concept.id)}>
                    {localize(concept.title, locale)}
                  </button>
                  {index < unlocks.length - 1 ? "、" : ""}
                </span>
              )) : text.none}
            </dd>
          </div>
          <div>
            <dt>{text.interaction}</dt>
            <dd>{interactionLabels[locale][selected.interaction.kind]}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
