# Foundation Design System

Foundation uses three distinct sources of direction:

```text
Information architecture / reading structure
        Crafting Interpreters
                +
Visual language / interaction restraint
        Apple design principles
                +
Product-specific behavior
        Foundation
  Chinese-first / knowledge graph / interactive labs
```

These roles must not be collapsed into one vague idea of "Apple-like".

## 1. What comes from Crafting Interpreters

Crafting Interpreters is the structural reference for long-form technical learning:

- chapter-oriented reading;
- continuous prose instead of dashboard cards;
- clear heading hierarchy;
- code, diagrams, asides, challenges, and design notes embedded in the reading flow;
- progressive implementation that builds on previous material;
- previous/next chapter navigation;
- supplemental information that can sit beside the main text without interrupting it.

Reference:
- https://craftinginterpreters.com/introduction.html
- https://craftinginterpreters.com/contents.html

Foundation does **not** copy its visual styling, typography, illustrations, or prose.

## 2. What comes from Apple design

Apple's design guidance is the visual and interaction reference:

- content-first hierarchy;
- deliberate alignment;
- generous negative space;
- familiar navigation;
- progressive disclosure;
- restrained use of color;
- controls visually distinct from content;
- adaptive layouts that preserve hierarchy across screen sizes.

Reference:
- https://developer.apple.com/design/human-interface-guidelines/layout
- https://developer.apple.com/design/human-interface-guidelines/column-views
- https://developer.apple.com/design/human-interface-guidelines/toolbars

Foundation does **not** imitate native Apple surfaces literally. In particular, do not add glass, blur, shadows, or rounded containers merely to look "Apple-like".

## 3. What is uniquely Foundation

Foundation adds:

- Chinese as the primary language;
- English as a first-class secondary language;
- a prerequisite-aware knowledge graph;
- interactive visualizers, simulations, and labs;
- explicit links from fundamentals back to Agent engineering;
- AI-native repository contracts for durable authoring and implementation.

## 4. Precedence

When design concerns conflict, use this order:

1. conceptual correctness;
2. reading comprehension;
3. accessibility;
4. structural consistency;
5. interaction clarity;
6. visual polish.

A beautiful layout that weakens comprehension is incorrect.

## Design documents

- [Reading architecture](./reading-architecture.md)
- [Sidebar and aside system](./sidebar-system.md)
- [Visual system](./visual-system.md)
- [Content blocks](./content-blocks.md)
- [Concept page template](./concept-page-template.md)

Any non-trivial concept-page UI change must read these documents before implementation.
