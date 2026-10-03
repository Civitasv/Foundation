"use client";

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
    awareness: "awareness",
    understanding: "understanding",
    implementation: "implementation",
    "deep-dive": "deep dive"
  }
};

const copy = {
  "zh-CN": {
    requires: "前置知识",
    unlocks: "解锁",
    noneRequired: "当前种子图中没有前置知识。",
    noneUnlocked: "当前种子图中没有后续节点。",
    interaction: "交互目标",
    noneAssigned: "尚未分配",
    empty: "还没有知识节点。"
  },
  en: {
    requires: "Requires",
    unlocks: "Unlocks",
    noneRequired: "No prerequisites in the seed graph.",
    noneUnlocked: "No dependent seed concepts yet.",
    interaction: "Interactive target",
    noneAssigned: "Not assigned yet",
    empty: "No concepts have been added yet."
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

  if (!selected) {
    return <p>{text.empty}</p>;
  }

  const prerequisites = selected.prerequisites
    .map((id) => byId.get(id))
    .filter((concept): concept is ConceptMetadata => concept !== undefined);

  const unlocks = concepts.filter((concept) =>
    concept.prerequisites.includes(selected.id)
  );

  return (
    <div className="explorer">
      <div className="domain-stack" aria-label="Concept map">
        {domainOrder.map((domain) => {
          const nodes = concepts.filter((concept) => concept.domain === domain);
          if (nodes.length === 0) return null;

          return (
            <section className="domain-row" key={domain}>
              <div className="domain-label">{domainLabels[locale][domain]}</div>
              <div className="concept-row">
                {nodes.map((concept) => (
                  <button
                    className="concept-node"
                    data-active={concept.id === selected.id}
                    key={concept.id}
                    onClick={() => setSelectedId(concept.id)}
                    type="button"
                  >
                    <span>{localize(concept.title, locale)}</span>
                    <small>{depthLabels[locale][concept.depth]}</small>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <aside className="concept-inspector" aria-live="polite">
        <div className="inspector-kicker">
          {domainLabels[locale][selected.domain]} · {depthLabels[locale][selected.depth]}
        </div>
        <h3>{localize(selected.title, locale)}</h3>
        <p>{localize(selected.summary, locale)}</p>

        <div className="inspector-block">
          <h4>{text.requires}</h4>
          {prerequisites.length > 0 ? (
            <div className="chip-row">
              {prerequisites.map((concept) => (
                <button key={concept.id} type="button" onClick={() => setSelectedId(concept.id)}>
                  {localize(concept.title, locale)}
                </button>
              ))}
            </div>
          ) : (
            <span className="muted">{text.noneRequired}</span>
          )}
        </div>

        <div className="inspector-block">
          <h4>{text.unlocks}</h4>
          {unlocks.length > 0 ? (
            <div className="chip-row">
              {unlocks.map((concept) => (
                <button key={concept.id} type="button" onClick={() => setSelectedId(concept.id)}>
                  {localize(concept.title, locale)}
                </button>
              ))}
            </div>
          ) : (
            <span className="muted">{text.noneUnlocked}</span>
          )}
        </div>

        <div className="interaction-callout">
          <span>{text.interaction}</span>
          <strong>{selected.interaction.kind}</strong>
          <small>{selected.interaction.component ?? text.noneAssigned}</small>
        </div>
      </aside>
    </div>
  );
}
