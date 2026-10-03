# Reading Components

This directory is the future presentation boundary for M1 concept pages.

Do not place canonical lesson content here.

## Intended component families

```text
ChapterShell
  ├─ ChapterHeader
  ├─ TableOfContents
  ├─ ReadingColumn
  │    ├─ Equation
  │    ├─ Figure
  │    ├─ CodeStep
  │    ├─ DesignNote
  │    └─ ReferenceList
  ├─ AsideRenderer
  ├─ InteractiveBreakout
  └─ PrevNext
```

## Boundary

- `content/` owns lesson meaning.
- `@foundation/knowledge` owns relationships and ordering.
- reading components own presentation.
- interactive lab packages own interactive behavior.

A reading component must not become a second source of curriculum truth.

Fenced code blocks are highlighted during MDX compilation with Shiki's GitHub Light theme. Language tags such as `ts` select the grammar; unsupported tags fall back to plain text. The static HTML includes token colors, so highlighting requires no client-side script. Inline code retains its normal prose styling.

## Sidebar rule

Components receive semantic aside data and choose a responsive presentation.

Do not encode "right sidebar" as the content model.

See:
- `docs/design/reading-architecture.md`
- `docs/design/sidebar-system.md`
- `docs/design/visual-system.md`
