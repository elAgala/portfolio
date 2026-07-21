# Product & Open-Work Evidence Tasks

## Implementation

- [x] Confirm sub-feature 00 has landed.
- [x] Filesystem-check every `data/lab.ts` product `image` path exists under `public/images/`. Both present (`agala-product-smaltt.webp`, `agala-product-kervo.webp`).
- [x] `curl` every `data/projects.ts` `repository` URL and both live product `href` URLs; confirm 200 responses. All 5 returned 200 (smaltt.agala.com.ar, kervo.agala.com.ar, github.com/elAgala/agala-ui, /agala-ai, /agala-setup).
- [x] Visually re-screenshot `#products` and `#work` at all five breakpoints; diff against this session's earlier "good" captures for color/layout regressions from the token rename. No regressions — brass/wine/paper tokens all resolved correctly, alternating product layout intact.
- [x] Read `ProjectRelease.vue`'s section header markup/CSS; confirm it does not share the fixed `.section-intro` 3-column grid bug. Confirmed: `#work` header renders single-column via the sub-feature-00 fix, no orphaned grid space.
- [x] Re-read all Products/Open-work copy for AI-tell patterns; fix any found using the same standard applied to Systems this session. None found — "Two products, live in production," "The reusable parts stay inspectable" and surrounding copy are already concrete, no contrastive "not X, Y" filler.

## Verification

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run test`
- [x] Visual sweep at 320/390/768/1024/1440 for `#products` and `#work`.
- [x] Manual click-through of all five external links (2 products + 3 repos) — verified via `curl` 200 checks above.

## Notes

- Expected outcome is "confirmed fine, no changes" unless the audit surfaces something concrete — do not manufacture changes to appear productive.
- Can run in parallel with sub-feature 03.
