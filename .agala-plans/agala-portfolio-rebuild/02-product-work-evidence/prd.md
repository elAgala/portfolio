# Product & Open-Work Evidence PRD

## Problem

The Products section (real Smaltt/Kervo screenshots, alternating layout) and the Open Work section (`ProjectRelease.vue` case-study list) are the two "here is real proof" sections on the page. Earlier this session the Products section was rebuilt with real screenshots and was not flagged as a problem afterward; Open Work has not been touched or specifically criticized. Neither has been audited against the Personal-Iconography Doctrine or reviewed for whether it still reads as generic. This slice is a deliberate audit-and-polish pass, not a rebuild, so effort is proportional to actual risk.

## Users

- **Technical visitors evaluating real work:** this is where they look for proof after the hero. Needs to be scannable and credible, not another wall of adjectives.

## Goals

- Confirm the Products section (real screenshots, browser-chrome frame, alternating layout) still holds up visually after sub-feature 00's token rename and sub-feature 01's hero changes (no regressions from shared CSS).
- Audit Open Work (`ProjectRelease.vue`) for the same "giant heading + empty space" and "templated copy" defects that were found and fixed elsewhere this session — confirm it was never actually affected, or fix it if it was.
- Ensure both sections' screenshots/links are current (Smaltt/Kervo screenshots not stale, GitHub links correct).

## Non-Goals

- Not re-shooting Smaltt/Kervo screenshots unless they're found to be stale or broken.
- Not changing the Products/Open Work IA or section order.
- Not adding new data fields unless an audit finds a real gap (e.g., missing real screenshot for a project).

## User Stories

- As a visitor, I want to see real product screenshots and real repo links, so that I trust the work is real.
- As Julián, I want this section to keep working correctly after the token rename and hero replacement, so that a foundational change elsewhere doesn't quietly break the one section that was already working.

## Functional Requirements

1. Re-render Products section after sub-feature 00's token rename; confirm brass/wine/ink colors still resolve correctly (this section uses the renamed tokens extensively: eyebrow color, framebar dots, link color).
2. Audit `ProjectRelease.vue` and its `pages/index.vue` "Open work" section header against the `.section-intro` pattern fixed in sub-feature 00 — confirm no orphaned-grid-cell defect exists here (it shares the class).
3. Confirm all three `data/projects.ts` `repository` URLs and both `data/lab.ts` product `href`/`image` fields are still correct and the referenced screenshot files exist in `public/images/`.
4. Spot-check Open Work copy for the same AI-tell patterns already fixed in Systems this session (contrastive "not X, Y" constructions, formulaic triplets) — fix any found.

## Acceptance Criteria

- Given the site rebuilt after sub-feature 00, when the Products section renders, then all brass/wine/ink colors match the renamed tokens with no fallback/undefined CSS variable.
- Given `ProjectRelease.vue` renders at all five breakpoints, then no orphaned empty grid space appears (same check as the Systems/Products fix).
- Given each `data/projects.ts` entry, when its `repository` URL is checked, then it resolves to a real, current GitHub repo under `github.com/elAgala`.
- Given each `data/lab.ts` product `image` path, when checked against `public/images/`, then the file exists and is a current screenshot (re-capture if the live product's UI has visibly changed since the screenshot was taken).

## Metrics

- Zero broken image/link references.
- Zero remaining AI-tell copy patterns in this section (qualitative, checked by re-reading, same standard already applied to Systems this session).

## Dependencies

- Sub-feature 00 (token rename) must land first so this audit is against final token names.
