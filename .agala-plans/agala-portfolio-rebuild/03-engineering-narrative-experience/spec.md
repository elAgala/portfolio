# Engineering Narrative & Experience Technical Spec

## Scope

`pages/index.vue` `#systems` section markup, `components/workbench/WorkbenchExperience.vue`, and their corresponding CSS rules in `assets/css/main.css` (`.decision-list*`, `.experience-list*`). No data or type changes.

## Files And Modules

| Path | Change |
| --- | --- |
| `pages/index.vue` | `#systems` section: remove `<span>0{{ index + 1 }}</span>` index markup from the `v-for` loop; change wrapping element/class from numbered-row-list to card-grid (e.g. rename `decision-list` usage or add a grid modifier class) |
| `assets/css/main.css` — `.decision-list` block | Replace row-grid-with-bottom-border rules with a card-grid: `display: grid; grid-template-columns: 1fr 1fr` (desktop), full-border cards, gap-based spacing; remove the index-`<span>` color rule (no longer rendered) |
| `components/workbench/WorkbenchExperience.vue` | Add rail/dot markup — either extra CSS-only pseudo-elements (no template change needed if done via `::before`/`::after` on `.experience-list` and its `<li>`) or a small `<span class="experience-list__dot">` per entry if pseudo-elements can't cleanly align to the `<time>` element |
| `assets/css/main.css` — `.experience-list` block | Add rail line + dot rules; keep existing 3-column grid, dated-row structure, and responsive breakpoints otherwise unchanged |

## Data Model

No changes. Reuses `EngineeringDecision { title, narrative, tools }` and `CareerEntry` unchanged.

## API Contract

Not applicable.

## Frontend State

Not applicable — static render, no new component state.

## Backend Flow

Not applicable.

## Permissions And Validation

Not applicable.

## Observability

Not applicable.

## Tests

- Unit/content: `npm run test` — no data shape changes, existing `tests/content.spec.ts` assertions on `engineeringDecisions`/`careerEntries` should pass unchanged.
- Visual: screenshot `#systems` and `#experience` at all five breakpoints; confirm (a) no orphaned grid space (same check pattern as sub-feature 00), (b) the two sections are visually distinguishable from each other in silhouette, (c) the rail/dot aligns correctly with each entry's date at every breakpoint including the mobile single-column collapse.
- Accessibility: rail/dot must be decorative only (`aria-hidden="true"` on any purely visual pseudo-element/span) — must not introduce new unlabeled interactive-seeming elements; re-run `scripts/verify-workbench.mjs --audit` to confirm no new accessibility regressions.

## Rollout Notes

- Can run in parallel with sub-feature 02 — both only depend on sub-feature 00.
- Keep this as a layout-only diff; do not bundle copy rewrites unless discovered incidentally per `design.md`'s Copy note.
