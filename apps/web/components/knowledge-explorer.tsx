"use client";

import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
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
    read: "阅读本章",
    empty: "暂无章节。内容准备好后会出现在这里。",
    previousPage: "上一页",
    nextPage: "下一页",
    page: "页"
  },
  en: {
    requires: "Requires",
    unlocks: "Next",
    interaction: "Interaction",
    none: "None",
    read: "Read chapter",
    empty: "No chapters yet. They will appear here when available.",
    previousPage: "Previous page",
    nextPage: "Next page",
    page: "Page"
  }
} satisfies Record<FoundationLocale, Record<string, string>>;

export function KnowledgeExplorer({
  concepts,
  locale
}: Readonly<{ concepts: ConceptMetadata[]; locale: FoundationLocale }>) {
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState(concepts[0]?.id ?? "");
  const text = copy[locale];
  const selected = concepts.find((concept) => concept.id === selectedId) ?? concepts[0];

  const byId = useMemo(
    () => new Map(concepts.map((concept) => [concept.id, concept])),
    [concepts]
  );

  if (!selected) return <p className="catalog-empty" role="status">{text.empty}</p>;

  const pageSize = 40;
  const pageCount = Math.ceil(concepts.length / pageSize);
  const currentPage = Math.min(page, pageCount - 1);
  const visibleConcepts = concepts.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  function selectConcept(id: string) {
    setSelectedId(id);
    const index = concepts.findIndex(concept => concept.id === id);
    if (index >= 0) setPage(Math.floor(index / pageSize));
  }

  function selectPage(next: number) {
    setPage(next);
    setSelectedId(concepts[next * pageSize]?.id ?? "");
  }

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

  function renderDetail(id: string, className: string) {
    if (!selected) return null;
    return (
      <aside className={className} id={id} aria-labelledby={`${id}-title`}>
        <div className="concept-meta">
          {domainLabels[locale][selected.domain]} · {depthLabels[locale][selected.depth]}
        </div>
        <h2 id={`${id}-title`} aria-live="polite">{localize(selected.title, locale)}</h2>
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
                  <button type="button" onClick={() => selectConcept(concept.id)}>
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
                  <button type="button" onClick={() => selectConcept(concept.id)}>
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
    );
  }

  return (
    <div className="explorer">
      <div className="concept-browser">
        {domainOrder.map((domain) => {
          const nodes = visibleConcepts.filter((concept) => concept.domain === domain);
          if (nodes.length === 0) return null;

          return (
            <section className="concept-group" key={domain}>
              <h2>{domainLabels[locale][domain]}</h2>
              <div className="concept-list">
                {nodes.map((concept) => (
                  <Fragment key={concept.id}>
                    <button
                      className="concept-row"
                      aria-controls="concept-detail concept-detail-mobile"
                      aria-pressed={concept.id === selected.id}
                      onClick={() => selectConcept(concept.id)}
                      type="button"
                    >
                      <span>{localize(concept.title, locale)}</span>
                      <span aria-hidden="true">›</span>
                    </button>
                    {concept.id === selected.id ? renderDetail("concept-detail-mobile", "concept-detail concept-detail-mobile") : null}
                  </Fragment>
                ))}
              </div>
            </section>
          );
        })}
        {pageCount > 1 ? <nav className="catalog-pagination" aria-label={locale === "zh-CN" ? "章节分页" : "Chapter pages"}>
          <button type="button" disabled={currentPage === 0} onClick={() => selectPage(currentPage - 1)}>{text.previousPage}</button>
          <span>{locale === "zh-CN" ? `${currentPage + 1} / ${pageCount} ${text.page}` : `${text.page} ${currentPage + 1} / ${pageCount}`}</span>
          <button type="button" disabled={currentPage === pageCount - 1} onClick={() => selectPage(currentPage + 1)}>{text.nextPage}</button>
        </nav> : null}
      </div>

      {renderDetail("concept-detail", "concept-detail concept-detail-desktop")}
    </div>
  );
}
