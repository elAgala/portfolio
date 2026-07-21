# Engineering Narrative & Experience Tasks

## Implementation

- [x] Confirm sub-feature 00 has landed.
- [x] Rewrite `#systems` markup in `pages/index.vue`: dropped the `0{{ index + 1 }}` index span and the `<ol>`, now a `<div class="decision-grid">` of `<article>` cards.
- [x] Rewrite `.decision-list` CSS rules (and its 760px responsive override) as `.decision-grid` — bordered 2-column card grid, 1-column on mobile.
- [x] Add rail/dot markup and CSS to `WorkbenchExperience.vue` / `.experience-list` rules, aligned to each entry's `<time>` element. Implemented as pure CSS `::before` pseudo-elements (no template change needed) — decorative generated content is not exposed to assistive tech, satisfying the "aria-hidden" intent without extra markup.
- [x] Re-check both sections' responsive breakpoints (980px, 760px) for the layout changes. Confirmed clean at 320/390/768/1024/1440.
- [x] (Found during implementation, not in original task list) First attempt at the rail dot positioned it directly on top of the year digits (e.g. "●021–Present" instead of a dot beside "2021–Present") — absolute-positioned offsets on a child are measured from the *padding edge* of the positioned ancestor, not from wherever visually seemed reasonable, so a positive `left` landed inside the content column instead of the gutter reserved for it. Fixed by using negative `left` values to place the line/dot within the `.experience-list`'s own `padding-left` gutter. Verified visually before/after.

## Verification

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run test`
- [x] Visual sweep at 320/390/768/1024/1440 for `#systems` and `#experience`.
- [x] Side-by-side screenshot comparison confirming the two sections read as visually distinct (bordered card grid vs. dotted rail timeline).
- [x] `--audit` accessibility pass confirms no new unlabeled/decorative-but-focusable elements (node count dropped slightly from removing the index-number text nodes, no new landmark/naming issues).

## Notes

- Can run in parallel with sub-feature 02.
- If real content needs minor rewording to fit the new card/rail shapes (e.g. a narrative paragraph reads awkwardly in a narrower card column), prefer reflowing/trimming over inventing new copy.
