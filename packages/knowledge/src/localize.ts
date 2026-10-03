import type { FoundationLocale, LocalizedText } from "./types";

export function localize(text: LocalizedText, locale: FoundationLocale): string {
  return text[locale];
}
