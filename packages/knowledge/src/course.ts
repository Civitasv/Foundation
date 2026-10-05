import { conceptStatuses, foundationLocales, type ConceptStatus, type FoundationLocale, type LocalizedText } from "./types";

export interface PresentationSection {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  sourceWeeks: number[];
}

export interface PresentationCourse {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  status: ConceptStatus;
  presentationLocale: FoundationLocale;
  presentationTrace: string;
  sections: PresentationSection[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLocalizedText(value: unknown): value is LocalizedText {
  return isRecord(value) && foundationLocales.every((locale) =>
    typeof value[locale] === "string" && value[locale].trim().length > 0
  );
}

export function assertPresentationCourse(value: unknown): asserts value is PresentationCourse {
  if (!isRecord(value)) throw new Error("Presentation course must be an object.");
  if (typeof value.id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.id)) {
    throw new Error("Course id must be lowercase kebab-case.");
  }
  if (!isLocalizedText(value.title) || !isLocalizedText(value.subtitle) || !isLocalizedText(value.description)) {
    throw new Error(`Course ${value.id}: localized title, subtitle and description are required.`);
  }
  if (!conceptStatuses.some((status) => status === value.status)) {
    throw new Error(`Course ${value.id}: invalid status.`);
  }
  if (!foundationLocales.some((locale) => locale === value.presentationLocale)) {
    throw new Error(`Course ${value.id}: invalid presentation locale.`);
  }
  if (typeof value.presentationTrace !== "string" || !/^[a-z][a-z0-9_]*$/.test(value.presentationTrace)) {
    throw new Error(`Course ${value.id}: invalid presentation trace.`);
  }
  if (!Array.isArray(value.sections) || value.sections.length === 0) {
    throw new Error(`Course ${value.id}: at least one section is required.`);
  }
  const ids = new Set<string>();
  for (const section of value.sections) {
    if (!isRecord(section) || !isLocalizedText(section.title) || !isLocalizedText(section.summary)) {
      throw new Error(`Course ${value.id}: each section needs a localized title and summary.`);
    }
    if (typeof section.id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(section.id)) {
      throw new Error(`Course ${value.id}: invalid section id.`);
    }
    if (ids.has(section.id)) throw new Error(`Course ${value.id}: duplicate section id ${section.id}.`);
    ids.add(section.id);
    if (!Array.isArray(section.sourceWeeks) || section.sourceWeeks.length === 0 ||
        !section.sourceWeeks.every((week) => Number.isInteger(week) && week > 0)) {
      throw new Error(`Course ${value.id}: source weeks must be positive integers.`);
    }
  }
}
