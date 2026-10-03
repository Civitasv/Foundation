# Interaction and resilience audit — 2026-10-03

## Scope and decisions

Reviewed the chapter catalog, bilingual reader, TOC, navigation, and all four implemented labs using mobile-native, find-animation-opportunities, improve-animations, pick-ui-library, and break-ui. The user requested implementation of the overall optimization, so actionable fixes were applied after reporting the reproduced failures. This small UI was audited directly without delegation.

The stack is Next.js / React, native HTML controls, SVG, and CSS transitions. No motion or component library is installed. Reading is the primary activity: chapter selection and slider changes are frequent; language changes, TOC disclosure, and pagination are occasional. There are no modals, toasts, carousels, onboarding, or drag-to-dismiss surfaces to audit.

## Data boundary map

| Rendered value | Source | Type / limit | Optional? |
| --- | --- | --- | --- |
| Chapter title and summary | `ConceptMetadata.title/summary`, localized | Strings, minimum 1 character, unbounded maximum | No |
| Domain label | `ConceptMetadata.domain` | Five-value enum, localized UI label | No |
| Depth label | `ConceptMetadata.depth` | Four-value enum, localized UI label | No |
| Interaction label | `ConceptMetadata.interaction.kind` | Four-value enum, localized UI label | No |
| Prerequisite / successor titles | Canonical IDs and derived reverse relationships | Unique IDs, no collection maximum; title limits as above | Empty lists permitted |
| Read link target | Validated concept ID plus locale | Kebab-case ID, unbounded maximum | No |
| Catalog size, selection, pagination | Catalog array and local UI state | No catalog-size limit; page size 40 | Empty catalog permitted |
| Locale and navigation labels | Bilingual UI copy | Two supported locales, no external text | No |
| Lab coordinates, matrix entries, weights | Native range inputs | Vector −5…5, dot coordinates −5…5, matrix −2…2, weights 0…10 | No |
| Lab results / sample | Derived numeric values | Finite domain from bounded controls; no sample initially | Sample optional |

Status, tags, and optional component names are not rendered in the catalog. Images, people, emails, dates, currencies, API loading/error states, dark themes, and RTL are not product surfaces here; fixtures do not fabricate those capabilities. Both supported locales and the current light theme are covered.

## What broke and what changed

| # | Severity | Field / worst case | Reproduced result | Fix location |
| --- | --- | --- | --- | --- |
| 1 | Broken | Title `KVCacheMemoryManagementAndRecomputation` | 320px page expanded to 440px; row action pushed off-screen. With 200% root text it reached 840px. | `apps/web/app/globals.css`: `.concept-row > span:first-child` gets `min-width: 0` and `overflow-wrap: anywhere`; trailing arrow does not shrink; detail titles wrap. |
| 2 | Broken | Empty catalog | Explorer returned nothing, with no explanation. | `apps/web/components/knowledge-explorer.tsx`: localized status message. |
| 3 | Broken | 1,000 chapters | 1,000 buttons; mobile inspector started over 60,000px below the catalog opening. | `apps/web/components/knowledge-explorer.tsx`: 40-item pages and inspector immediately after the selected row on mobile; page changes select the first visible item. |
| 4 | Fragile | Touch on graph background | `touch-action: none` covered the entire SVG, blocking vertical page scrolling there. | `apps/web/app/reading.css`: SVG allows vertical panning and pinch zoom; only drag handles own the gesture. Three lab components add transparent, non-scaling hit strokes without enlarging visible marks. Real touch feel remains pending. |
| 5 | Fragile | Tap and long-press | Hover styling was not gated; controls relied partly on platform feedback. | `apps/web/app/globals.css` and `reading.css`: capability-gated hover, immediate active feedback, manipulation on taps, selection disabled only for controls. Real-device verification pending. |
| 6 | Broken | Probability set notation | MDX interpreted unescaped curly braces instead of displaying the full set. | Both probability MDX files escape literal braces. |
| 7 | Fragile | Four zero weights | Lab silently displayed its uniform fallback, despite zero weights being non-normalizable. | `distribution-playground.tsx`: localized status explicitly explains the fallback and how to recover. |

## Decisions resolved

- Wrap complete identifying titles; do not truncate information readers need to distinguish chapters.
- Use ordinary pagination for the large-catalog case, not a new virtualization dependency. It bounds render count, preserves semantic groups and keyboard behavior, and only appears beyond 40 items. Virtuoso is the curated choice if a future product requirement demands a continuous virtual list.
- Keep native sliders and TOC disclosure. No custom dialog, menu, animated counter, or shared-state library is warranted. More complex future popovers would call for Base UI; genuine springs/layout/exit motion would call for Motion. Current feedback uses CSS.
- Keep document scrolling and zoom available. Do not disable root overscroll, impose a full-screen app height, disable zoom, or make prose unselectable.
- The site currently supports light appearance only; white theme-color matches its header in either OS appearance. No false dark-mode claim or theme system was added.

## Motion audit and opportunities

| Priority | Category / location | Finding and recipe | Frequency / purpose | Outcome |
| --- | --- | --- | --- | --- |
| 1 | Feedback / `globals.css` controls | Missing consistent press feedback. Active opacity is 0.7 immediately; release uses opacity 120ms `cubic-bezier(0.23, 1, 0.32, 1)`. | Tens/day; feedback; no displacement, no input blocking | Applied |
| 2 | Accessibility / both CSS files | Hover styles were unconditional. Gate every rule with `(hover: hover) and (pointer: fine)`. | Tens/day; input-appropriate feedback | Applied |
| 3 | Cohesion / CSS transitions | Repeated duration literals. Shared 120ms feedback, 140ms color, 160ms selection tokens. | Frequent; predictable response | Applied |

Reduced-motion behavior deliberately remains the project's established rule: no transitions and immediate state feedback. This documented decision is respected, not reported as a new defect. No keyframes, `transition: all`, layout-property animation, delayed tooltips, spring interruptions, or mixed animation libraries were found.

Rejected candidates:

- Chapter text and route entrances: functional information readers need immediately; choreography fails the function gate.
- Slider/graph interpolation and animated numerical outputs: high-frequency direct manipulation; delayed intermediate values would misrepresent the experiment.
- Keyboard chapter selection: keyboard-initiated changes remain immediate.
- Inspector crossfades and list staggers: frequent navigation, reflow and long text; motion would complicate reading and add no necessary spatial explanation.
- TOC height animation: native disclosure is already legible; animating layout height is not justified.

The highest-leverage motion improvement is consistent press feedback. The interface needs little additional motion.

## What held up and verification

- Complete CJK/English titles, one-letter titles, Vietnamese diacritics, emoji, literal markup, long summaries/URLs, and mixed empty/populated relations remain readable. React escapes fixture markup; it does not execute it.
- Catalog tested at 320px, its actual desktop two-column container at 1440px, and 2560px. Reading/catalog widths remain bounded. Catalog at 320px with 200% root text has no horizontal overflow after fixes.
- Empty, One, 40, 41, and 1,000 item fixtures checked. 40 has no pagination; 41 yields 40 then one, disables Next at the last page, and keeps a selected visible entry. 1,000 renders 40 rows per page.
- All 18 bilingual chapter routes checked at 320px without page overflow. Viewport metadata includes safe-area cover and resizes-content; zoom remains enabled and theme-color is white.
- Probability zero weights display an explicit explanation, finite uniform fallback values, and clear after reset. The set notation displays `X ∈ {0, 1, 2, 3}`.
- Pressure fixture strings are excluded from production JavaScript. The toggle is only mounted in development.
- No real phone is connected. Sticky touch hover, Safari safe areas / toolbar behavior, pinch zoom, drag-versus-scroll arbitration, landscape font inflation, and tap latency require iOS/Android hardware verification; responsive checks do not establish those behaviors.

## Reusable dev-only toggle

Open `http://localhost:3000/?stress&data=worst` while running `pnpm dev`. Bottom control offers Demo data / Worst case / Empty / One / 40 rows / 41 rows / 1,000 rows. Add `&text=large` for 200% root text. Selection persists in the URL and swaps data at the same catalog props boundary. Fixtures are UI-only and do not alter canonical concepts. Production has neither the toggle nor fixture data.
