"use client";

import { useMemo, useState } from "react";
import type {
  ConceptDomain,
  ConceptMetadata
} from "@foundation/knowledge";

const domainLabels: Record<ConceptDomain, string> = {
  foundations: "Foundations",
  models: "Models",
  agents: "Agents",
  systems: "Systems",
  production: "Production"
};

const domainOrder: ConceptDomain[] = [
  "foundations",
  "models",
  "agents",
  "systems",
  "production"
];

export function KnowledgeExplorer({
  concepts
}: Readonly<{ concepts: ConceptMetadata[] }>) {
  const [selectedId, setSelectedId] = useState(concepts[0]?.id ?? "");

  const selected = concepts.find((concept) => concept.id === selectedId) ?? concepts[0];

  const byId = useMemo(
    () => new Map(concepts.map((concept) => [concept.id, concept])),
    [concepts]
  );

  if (!selected) {
    return <p>No concepts have been added yet.</p>;
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
              <div className="domain-label">{domainLabels[domain]}</div>
              <div className="concept-row">
                {nodes.map((concept) => (
                  <button
                    className="concept-node"
                    data-active={concept.id === selected.id}
                    key={concept.id}
                    onClick={() => setSelectedId(concept.id)}
                    type="button"
                  >
                    <span>{concept.title}</span>
                    <small>{concept.depth}</small>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <aside className="concept-inspector" aria-live="polite">
        <div className="inspector-kicker">
          {domainLabels[selected.domain]} / {selected.status}
        </div>
        <h3>{selected.title}</h3>
        <p>{selected.summary}</p>

        <div className="inspector-block">
          <h4>Requires</h4>
          {prerequisites.length > 0 ? (
            <div className="chip-row">
              {prerequisites.map((concept) => (
                <button key={concept.id} type="button" onClick={() => setSelectedId(concept.id)}>
                  {concept.title}
                </button>
              ))}
            </div>
          ) : (
            <span className="muted">No prerequisites in the seed graph.</span>
          )}
        </div>

        <div className="inspector-block">
          <h4>Unlocks</h4>
          {unlocks.length > 0 ? (
            <div className="chip-row">
              {unlocks.map((concept) => (
                <button key={concept.id} type="button" onClick={() => setSelectedId(concept.id)}>
                  {concept.title}
                </button>
              ))}
            </div>
          ) : (
            <span className="muted">No dependent seed concepts yet.</span>
          )}
        </div>

        <div className="interaction-callout">
          <span>Interactive target</span>
          <strong>{selected.interaction.kind}</strong>
          <small>{selected.interaction.component ?? "Not assigned yet"}</small>
        </div>
      </aside>
    </div>
  );
}
