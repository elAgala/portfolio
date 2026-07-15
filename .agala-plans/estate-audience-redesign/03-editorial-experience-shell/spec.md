# Editorial Experience Shell Technical Spec

## Scope
Rebuild the homepage’s semantic component hierarchy and cinematic CSS around final camera safe zones, including fallback, responsive behavior, accessibility, and end-to-end verification.

## Files And Modules
| Path | Change |
| --- | --- |
| `pages/index.vue` | Reduce to chapter composition and SEO; remove scene-specific layout logic. |
| `components/chapters/` | Add Hero, Project Evidence, Profile Archive, Principles, and Contact chapter components. |
| `assets/css/portfolio.css` | Move/consolidate homepage cinematic styles out of the global mixed stylesheet. |
| `components/experience/ExperienceHud.vue` | Integrate chapter/sound/loading/fallback states accessibly. |
| `public/stills/estate-*.avif` | Add optimized scene renders for OG/fallback/reduced-motion presentation. |

## Data Model
- Reuse `ExperienceChapterConfig.htmlAlign` and shared project/profile data.
- `ExperienceShellState`: active chapter, active graph phase, ready/load phase, static mode, sound enabled.
- No content duplication: chapter components receive existing typed project/profile objects and graph annotation data.

## API Contract
No backend API changes. Existing routes and static prerender list remain unchanged.

## Frontend State
- The experience orchestrator provides shell state through props/emits or a page-scoped composable.
- Server render defaults to static/loading presentation; hydration upgrades it to WebGL without removing semantic content.
- Use CSS classes/data attributes for chapter alignment and static mode; avoid querying layout state from many components.

## Backend Flow
Not applicable.

## Permissions And Validation
- All external links retain safe target/rel behavior.
- Canvas remains `aria-hidden` and unfocusable.
- Sound starts only after a user gesture; controls expose `aria-pressed`.
- Intro and menu controls support Escape and visible focus.

## Observability
- No production tracking is added.
- E2E failures capture current chapter, quality tier, viewport, screenshot, and console errors.

## Tests
- Unit: shell state mapping, chapter alignment, sound/session preference, intro eligibility, and static-mode selection.
- Integration: anchor navigation, menu behavior, case-study/resume links, graph phase copy, and route teardown.
- UI/E2E/manual: visual regression for every chapter/tier; keyboard/focus; reduced motion; WebGL failure; 320–1440px overflow; print/PDF regression on `/resume`.

## Rollout Notes
- Keep `/resume`, its print stylesheet, and its PDF generation byte-for-byte visually equivalent unless a regression fix is required.
- Generate a new OG image from the final Study frame only after the scene and typography are approved.
- Remove obsolete current-scene CSS/components only after the static fallback and production screenshots pass.
