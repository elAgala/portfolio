# Product & Open-Work Evidence Technical Spec

## Scope

Audit-and-fix pass over `pages/index.vue`'s `#products`/`#work` sections, `components/workbench/ProjectRelease.vue`, `data/lab.ts`, `data/projects.ts`, and their referenced assets in `public/images/`. No new components planned; fixes are scoped to whatever the audit actually finds.

## Files And Modules

| Path | Change |
| --- | --- |
| `pages/index.vue` (`#products`, `#work` sections) | Re-render and visually confirm after sub-feature 00; fix only if a regression or pre-existing bug is found |
| `components/workbench/ProjectRelease.vue` | Audit against the `.section-intro` grid-auto-placement bug class; fix if found using the same single-column pattern from sub-feature 00 |
| `data/lab.ts` | Verify `image` paths resolve; verify `href` URLs are current |
| `data/projects.ts` | Verify `repository` URLs are current and correctly formatted (`https://github.com/elAgala/...`) |
| `public/images/agala-product-smaltt.webp`, `agala-product-kervo.webp` | Re-capture only if audit finds the live product UI has meaningfully changed since capture |

## Data Model

No schema changes expected. If the audit finds a project without a real visual asset worth showing, document the gap in this file's Rollout Notes rather than inventing a placeholder image (doctrine: real or nothing).

## API Contract

Not applicable.

## Frontend State

Not applicable — static content render.

## Backend Flow

Not applicable.

## Permissions And Validation

- Verify every `data/lab.ts` `image` path with a filesystem check: `test -f public/images/<file>` for each.
- Verify every `data/projects.ts` `repository` URL returns 200: `curl -s -o /dev/null -w "%{http_code}" <url>` for each (already the pattern used earlier this session to confirm `smaltt.agala.com.ar` / `kervo.agala.com.ar` were live).

## Observability

Not applicable.

## Tests

- Unit/content: `npm run test` — `tests/content.spec.ts` already asserts `productProofs` names/hrefs and `projects` slugs/order/repository-prefix; re-run unchanged, should still pass since no data changes are planned unless the audit finds a real problem.
- Visual: screenshot `#products` and `#work` at 320/390/768/1024/1440 after sub-feature 00 lands; compare against this session's already-captured "good" screenshots of these sections to confirm no regression from the token rename.
- Manual: click through both live product links and all three GitHub repo links to confirm they resolve.

## Rollout Notes

- This slice can run in parallel with sub-feature 03 once sub-feature 00 is done — neither depends on the other.
- If the audit finds nothing wrong (likely, since this section was not specifically criticized), the deliverable is the confirmation itself (screenshots + link-check output), not necessarily a code diff.
