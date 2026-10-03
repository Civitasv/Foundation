# Feature-03 — Chinese-first bilingual UI and restrained Apple-like theme

## Intent

Foundation's primary audience and product language is Chinese. English remains a first-class secondary language.

The visual direction should be calm, precise, and lightweight. It takes inspiration from Emil Kowalski's restrained design-engineering site and Apple's emphasis on hierarchy, spacing, clarity, and subtle material treatment, without cloning either source.

## Language contract

1. Chinese (`zh-CN`) is the default locale.
2. English is available through a small persistent language switch.
3. The user's explicit locale choice is stored locally.
4. Concept titles and summaries exist in both languages.
5. Chinese lesson content lives in `index.mdx`; English in `index.en.mdx`.
6. Knowledge graph semantics remain language-neutral.

## Visual contract

- neutral system sans suitable for Latin and CJK;
- warm near-white background and white surfaces;
- hairline borders and very soft shadows;
- one restrained system-blue accent;
- generous whitespace and a narrow primary reading column;
- wider breakout only for graph or simulation surfaces;
- no decorative entrance choreography;
- respect `prefers-reduced-motion`.

## Acceptance criteria

- first paint is Chinese;
- language switch changes homepage and concept-map copy;
- language preference persists;
- all seed concept metadata is bilingual;
- each seed concept has Chinese and English lesson source files;
- `pnpm check` passes;
- static export remains compatible with GitHub Pages.
