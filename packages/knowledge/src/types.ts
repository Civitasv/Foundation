export const conceptDomains = [
  "foundations",
  "models",
  "agents",
  "systems",
  "production"
] as const;

export const conceptDepths = [
  "awareness",
  "understanding",
  "implementation",
  "deep-dive"
] as const;

export const conceptStatuses = [
  "seed",
  "draft",
  "review",
  "complete"
] as const;

export const interactionKinds = [
  "none",
  "visualizer",
  "simulator",
  "lab"
] as const;

export type ConceptDomain = (typeof conceptDomains)[number];
export type ConceptDepth = (typeof conceptDepths)[number];
export type ConceptStatus = (typeof conceptStatuses)[number];
export type InteractionKind = (typeof interactionKinds)[number];

export interface ConceptInteraction {
  kind: InteractionKind;
  component?: string;
}

export interface ConceptMetadata {
  id: string;
  title: string;
  summary: string;
  domain: ConceptDomain;
  depth: ConceptDepth;
  status: ConceptStatus;
  prerequisites: string[];
  interaction: ConceptInteraction;
  tags: string[];
}

export interface KnowledgeNode extends ConceptMetadata {
  unlocks: string[];
}
