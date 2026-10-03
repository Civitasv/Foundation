# Reading Architecture

## Intent

Foundation concept pages are technical chapters, not product dashboards.

The structural reference is Crafting Interpreters: a stable reading column, long-form prose, strong section hierarchy, code and diagrams embedded in context, optional asides and sequential navigation.

The visual treatment is Foundation's Apple-inspired system defined separately in `visual-system.md`.

## Concept page anatomy

A mature concept page follows this anatomy:

```text
Global navigation
────────────────────────────────────────────────────────

Context / TOC      Main chapter                    Aside rail
(optional)         ────────────                    (optional)

                   Chapter identity
                   中文标题
                   English title (secondary)
                   Short lead / summary

                   Optional epigraph

                   Why it exists
                   Continuous prose
                                      prerequisite note
                   Intuition
                   figure / diagram
                                      definition
                   Mechanism / math
                   equation
                                      derivation note
                   Interactive lab ─────────────── breakout
                   Minimal implementation
                   precise code step
                                      source / caveat
                   Connection to Agent engineering

                   References

                   Previous          Next
────────────────────────────────────────────────────────
Footer
```

The main chapter remains a continuous reading flow. Side material supports it; it does not fragment it into cards.

## Default content sequence

Not every concept needs every section, but the default sequence is:

1. **为什么需要它 / Why it exists**
2. **直觉 / Intuition**
3. **机制或数学 / Mechanism or Mathematics**
4. **交互实验 / Interactive model**
5. **最小实现 / Minimal implementation**
6. **与 Agent 的关系 / Connection to Agent engineering**
7. **参考资料 / References**

Chapters do not include standalone exercise or quiz sections. Understanding comes from the explanations, worked examples, and interactive labs.

Authors may reorder sections when the concept demands it. The order must follow learning logic, not visual variety.

## Chapter identity

The first screen should establish:

- location in the curriculum;
- concept title;
- optional English title in the Chinese locale;
- one concise summary;
- prerequisites when they materially affect readiness.

Avoid marketing-style hero sections inside concept pages.

## Reading measure

The prose column is stable even on very wide screens.

Recommended desktop geometry:

```text
optional left rail   prose column      optional right rail
   12–14rem            42–44rem             14–18rem
```

The prose column must not expand merely because viewport space exists.

Wide content such as interactive labs, complex diagrams, tables, or code comparisons may deliberately break out from the prose measure.

## Heading hierarchy

Use a small fixed hierarchy:

- chapter title;
- H2 section;
- H3 subsection;
- H4 only when a technical derivation genuinely needs it.

Do not create visual pseudo-headings using arbitrary bold text.

Heading anchors should be stable so the TOC and deep links can be derived automatically.

## Numbering

Chapter and section numbers are navigational metadata, not decoration.

- Derive chapter numbers from a curriculum projection when one exists.
- Do not manually encode numbers inside concept prose.
- A free-exploration concept page may omit chapter numbering entirely.
- Heading numbering may appear in a guided learning path but should not be required by the source content.

## Sequential navigation

Every guided chapter can expose:

- previous concept;
- next concept;
- parent domain or learning path.

These relationships are derived from the curriculum/knowledge layer, never manually duplicated in MDX.

## Wide-screen layout

At large widths, Foundation may show:

- left rail: TOC, chapter navigation, progress;
- center: canonical prose;
- right rail: contextual asides.

Both rails are optional. The prose column remains visually dominant.

## Medium layout

When there is insufficient width for three columns:

- preserve the prose measure;
- keep at most one contextual rail;
- collapse the other rail into disclosure or inline placement.

Do not squeeze the prose column to preserve sidebars.

## Mobile layout

On narrow screens:

- sidebars disappear as spatial concepts;
- supplemental blocks re-enter the document near their semantic anchor;
- TOC becomes a disclosure or sheet;
- sticky interactive inspectors become inline controls;
- wide labs may use horizontal scrolling only when unavoidable.

Reading order must remain correct without CSS positioning.

## Long-form rule

If a page begins to look like a grid of unrelated panels, stop.

Concept pages should feel like a well-edited technical chapter with interactive capabilities, not an analytics dashboard.
