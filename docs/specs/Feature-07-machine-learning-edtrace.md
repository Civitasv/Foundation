# Feature-07 — Machine-learning review with edtrace

## Outcome

Publish one continuous Chinese Python presentation in Foundation, distilled from the author's seven weeks of older machine-learning notes. A theoretical argument connects foundations, backpropagation, kernels, and generalization through definitions, derivations and explicit assumptions. There are no application cases, datasets, training demonstrations or empirical model comparisons in the presentation. The presentation develops like a technical discussion rather than preserving the weekly divisions. It prepares for CS224N and CS336 without claiming either course has been completed.

The course is available at `/courses/machine-learning/`, with an English directory that clearly identifies the presentation as Chinese. One entry opens the complete `machine_learning` trace. The home page exposes the course alongside the existing CS336 journal.

## Content boundary

`content/courses/machine-learning/course.json` owns the presentation identity and discussion outline. The single Python presentation and background mathematical checks live in that directory. They do not depend on Next.js.

This is an `ai-draft` presentation, not an author-written concept chapter or a completed learning record. No graph dependencies, concept maturity, recorded videos, or learning progress are inferred. The original notes remain in the source repository.

The presentation follows the author's requested order exactly: (1) definition of machine learning, (2) multivariate linear regression, (3) gradient descent, (4) matrix operations, (5) classification with logistic regression, its cost function and update equations, (6) neural networks, (7) backpropagation, (8) learning curves, and (9) support vector machines and kernels. These are discussion sections within one presentation, not separate weekly decks.

Derive scalar regression gradients before introducing matrix notation. Classification reuses the update structure with sigmoid and cross-entropy. BP derives the layerwise recurrence; learning curves distinguish training size from optimization progress and explain bias/variance diagnostics with explicit limitations. The final section develops SVM margins before introducing kernels and the dual. Each derivation states notation and assumptions. Numerical audit fixtures remain exclusively in tests.

## Static publication

The existing static-export contract remains in force. Build Python traces and the pinned official edtrace frontend at build time, then place their static files in `apps/web/out/courses/machine-learning/presentation/`. No Python or model service runs on Pages.

The edtrace router and assets must use the actual hosting prefix: `${PAGES_BASE_PATH}/courses/machine-learning/presentation/`. Relative Vite base `./` is incompatible with this frontend's React Router basename and must not be used. Course links to this separate static application use normal anchors rather than Next.js client routing.

The canonical public directory is `https://civitasv.github.io/Foundation/courses/machine-learning/`. CI and Pages must run the numerical checks and build the same presentation artifacts. Generated traces, build caches, and Python environments are not curriculum source.

## Acceptance

- The complete Python presentation generates one valid edtrace trace.
- Background numerical checks audit regression, softmax, multilayer BP, kernel norm regularization and SVM primal/dual consistency against independent calculations. They do not appear as teaching examples or substitute for mathematical arguments.
- The directory uses canonical ordered course metadata and preserves Chinese-first, bilingual navigation.
- `pnpm check` passes with the Pages base path.
- The Pages workflow successfully publishes the resulting artifact.
- Public course links, presentation assets, Chinese text, formulas, and forward/backward exposition are checked in the browser.

## Known dependency

The pinned official frontend loads MathJax from its CDN. The presentation code and text are hosted on Pages; formula rendering requires access to that CDN. The frontend is not copied into Foundation's knowledge model.
