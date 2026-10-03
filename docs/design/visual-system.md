# Visual System

## Intent

Foundation should feel like a precise Apple-designed technical publication, not an Apple marketing clone.

The system uses Apple design principles — hierarchy, alignment, negative space, restrained color, familiar navigation, and progressive disclosure — while keeping the web experience simple and content-first.

## Typography

Use the system font stack.

```css
-apple-system,
BlinkMacSystemFont,
"SF Pro Text",
"SF Pro Display",
"PingFang SC",
"Hiragino Sans GB",
"Microsoft YaHei",
"Segoe UI",
sans-serif
```

Do not ship external font files merely for branding.

### Roles

| Role | Desktop baseline |
| --- | --- |
| Chapter title | 48–56px / 1.08 |
| Page display title | 56–64px / 1.06 |
| H2 | 32–36px / 1.2 |
| H3 | 21–24px / 1.3 |
| Body | 17px / 1.75–1.8 |
| Secondary body | 15px / 1.65 |
| Caption / metadata | 12–13px / 1.5 |
| Code | 13–14px / 1.6 |

Chinese body copy should have enough line height to avoid visual crowding.

Use negative letter spacing only for large display text. Do not aggressively tighten Chinese body text.

## Reading width

Canonical prose:
- `42–44rem` maximum width.

Wide breakouts:
- code comparisons;
- interactive labs;
- diagrams;
- tables;
- knowledge graph views.

Do not make ordinary paragraphs full-width.

## Color

Core palette:

```text
Page             #FFFFFF
Subtle section   #F5F5F7
Primary text     #1D1D1F
Secondary text   #6E6E73
Tertiary text    #86868B
Separator        #D2D2D7
Action/link      #0066CC
```

Rules:

- most of the interface is grayscale;
- blue indicates navigation or action;
- do not use blue as decoration;
- semantic colors for warning/success/error must be rare and accessible;
- do not add gradients as ambient decoration.

## Spacing

Use a constrained spacing scale:

```text
4, 8, 12, 16, 24, 32, 48, 64, 96, 128
```

Prefer fewer large gaps over many small boxes.

Typical chapter rhythm:

- chapter opening: 96–128px;
- major section separation: 72–96px;
- heading to first paragraph: 20–28px;
- paragraph gap: 20–24px;
- body to supplemental block: 32–48px.

## Containers

Default:
- no container.

Use a bounded surface only for:

- interactive labs;
- editable controls;
- code environments where the boundary improves reading;
- a stateful inspector;
- content that would otherwise be mistaken for prose.

Do not wrap every section in a card.

## Corners

Text and document sections do not need rounded corners.

For genuine interactive surfaces:

- small controls: 8–10px;
- lab surfaces: 12–16px;
- avoid exaggerated pill shapes unless the control semantics call for them.

## Shadows

Default: none.

A subtle shadow is acceptable only when a surface is actually elevated, such as:

- a floating popover;
- a temporary sheet;
- a detached inspector.

Do not use shadow merely to create "premium" appearance.

## Glass and blur

Do not imitate Liquid Glass as a visual gimmick.

A translucent navigation surface may use blur when it improves separation from scrolling content. The effect must remain secondary to the content.

## Separators

Use separators sparingly to establish relationships.

Preferred hierarchy:

1. whitespace;
2. alignment;
3. typography;
4. subtle separator;
5. container shape.

Do not start with borders.

## Links and actions

- text navigation: system blue;
- destructive/semantic actions: use semantic color only when needed;
- primary learning content should remain black/gray;
- filled buttons are reserved for actions that genuinely need emphasis.

Concept pages should rarely need a filled primary CTA.

## Motion

Motion must explain:

- state change;
- spatial relationship;
- continuity;
- cause and effect.

Baseline:
- 120–220ms for small transitions;
- natural easing;
- no decorative entrance choreography for article content;
- always respect `prefers-reduced-motion`.

Interactive labs can use richer motion because motion may be the subject being taught.

## Accessibility

At minimum:

- preserve semantic document order;
- keyboard access for interactive content;
- visible focus state;
- sufficient contrast;
- no information encoded by color alone;
- reduced-motion behavior;
- sidebars must have an inline/mobile reading equivalent.

## Anti-patterns

Do not introduce:

- dashboard card grids into chapters;
- decorative gradients;
- persistent glow;
- arbitrary glass panels;
- large amounts of pill UI;
- repeated badges for metadata;
- multiple competing accent colors;
- fake native macOS chrome;
- oversized marketing hero sections inside learning chapters.
