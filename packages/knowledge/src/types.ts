export const foundationLocales = ["zh-CN", "en"] as const;

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

export type FoundationLocale = (typeof foundationLocales)[number];
export type ConceptDomain = (typeof conceptDomains)[number];
export type ConceptDepth = (typeof conceptDepths)[number];
export type ConceptStatus = (typeof conceptStatuses)[number];
export type InteractionKind = (typeof interactionKinds)[number];

export interface LocalizedText {
  "zh-CN": string;
  en: string;
}

export interface ConceptInteraction {
  kind: InteractionKind;
  component?: string;
}

export interface ConceptMetadata {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
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
