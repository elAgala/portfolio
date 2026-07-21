# Product & Open-Work Evidence Design

## UX Intent

Scannable proof. A visitor should be able to tell, within a few seconds per item, what it is, what it does, and that it's real — without reading dense paragraphs.

## Layout

- **Products (`#products`):** unchanged from this session's rebuild — single-column stack of alternating image/copy rows (`.product-proof-list article`, `.is-reversed` flips order), each with a browser-chrome-framed real screenshot (`.product-proof__frame` + `.product-proof__framebar`) on one side and eyebrow/name/description/link on the other. Confirm this survives the token rename with no visual change.
- **Open work (`#work`):** unchanged structural layout (`ProjectRelease.vue` list) — audit only, no layout rebuild planned unless the audit finds the same 3-column-grid defect that affected `.section-intro` elsewhere (if found, apply the identical single-column fix from sub-feature 00, don't invent a second fix for the same bug class).

## Visual Hierarchy

Unchanged from current implementation — this is an audit slice. Document any hierarchy problem found during audit here before fixing, so the fix is traceable to an observation rather than a fresh guess.

## Component Plan

| Area | Component | Details |
| --- | --- | --- |
| Products | `pages/index.vue` `#products` section, `data/lab.ts` `productProofs` | No new components; re-verify against renamed tokens |
| Open work | `components/workbench/ProjectRelease.vue`, `data/projects.ts` | Audit against `.section-intro` bug class; fix only if found |

## Interaction Details

Unchanged — real external links (`target="_blank" rel="noreferrer"` for products, GitHub `repository` links for projects) with real hrefs, no new interaction.

## States

- **Broken image:** if a product screenshot fails to load, current markup has no explicit fallback (`<img>` with real `src`, `alt`, `width`/`height` — browser default broken-image treatment applies). Acceptable for this slice since screenshots are locally committed static assets, not remote-fetched; add an explicit fallback only if the audit finds a real risk (e.g., an `href`/`image` mismatch).

## Copy

- Re-read every heading/paragraph in `#products` and `#work` against the same standard already applied to Systems this session: no contrastive "not X, Y" filler, no formulaic three-part templates, concrete nouns/numbers preferred over adjectives. Record any rewrites made during the audit; do not rewrite copy that already passes this bar just to have something to change.

## Styling Notes

- No new tokens, no new classes expected beyond what already exists (`.product-proof-list`, `.product-proof__frame`, `.product-proof__framebar`, `.product-proof__copy`, `.project-release-list`, `.project-release`) — this slice consumes sub-feature 00's renamed tokens, it does not introduce new ones.
