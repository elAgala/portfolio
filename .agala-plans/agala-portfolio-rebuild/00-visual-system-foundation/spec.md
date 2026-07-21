# Visual System Foundation Technical Spec

## Scope

`assets/css/main.css` token rename; deletion of two unused components; addition of a Personal-Iconography Doctrine section to this repo's `CLAUDE.md`. No Vue template changes, no data changes, no new dependencies.

## Files And Modules

| Path | Change |
| --- | --- |
| `assets/css/main.css` | Rename `:root` custom properties (`--navy`→`--ink`, `--navy-deep`→`--ink-deep`, `--navy-raised`→`--ink-raised`, `--cobalt`→`--wine`, `--cobalt-light`→`--brass`, `--bone`→`--paper-bright`) and every `var(...)` call site. Leave `--paper`, `--ink` (if already correctly named), `--muted`, `--muted-dark`, `--line`, `--line-dark`, `--display`, `--mono`, `--gutter`, `--section` untouched — audit each existing name against its value first and only rename what is actually mismatched. |
| `components/RevealOnScroll.client.vue` | Delete |
| `components/SectionHeading.vue` | Delete |
| `CLAUDE.md` (repo root; create if it does not exist) | Add "Personal-Iconography Doctrine" section per `design.md` copy block |

## Data Model

Not applicable — no data shape changes.

## API Contract

Not applicable — static site, no API routes touched.

## Frontend State

Not applicable.

## Backend Flow

Not applicable.

## Permissions And Validation

Before deleting `RevealOnScroll.client.vue` / `SectionHeading.vue`, confirm zero usages:

```bash
grep -rn "RevealOnScroll\|SectionHeading" --include="*.vue" --include="*.ts" . \
  | grep -v node_modules \
  | grep -v "components/RevealOnScroll.client.vue\|components/SectionHeading.vue"
```

Must return no output before deletion proceeds.

Before considering the token rename complete, confirm zero stale references:

```bash
grep -n -- "--navy\b\|--cobalt\b\|--bone\b" assets/css/main.css
```

Must return no output (note: match on exact old names, not substrings that might collide with new names during a partial rename — do the rename in one pass, not incrementally, to avoid this).

## Observability

Not applicable — static marketing site, no runtime logging/metrics infra in this repo.

## Tests

- Unit/content: `npm run test` (Vitest, `tests/content.spec.ts`) must still pass unchanged — this slice does not touch any data or component the spec file asserts on.
- Type/lint: `npm run lint` and `npm run typecheck` must both report zero errors after deleting the two dead components (confirms nothing secretly imported them via a path grep missed).
- Visual: `npm run dev` + the existing `scripts/verify-workbench.mjs` screenshot sweep (320/390/768/1024/1440 + reduced-motion) captured before and after the rename; diff manually (no automated pixel-diff tooling in this repo) to confirm no visual change.
- Manual: read `CLAUDE.md` after the edit and confirm the doctrine section is present and matches `design.md`'s copy block.

## Rollout Notes

- Single commit for the rename (mechanical, high blast radius if half-done — a partially-renamed token set is worse than not starting). Do not mix with sub-feature 1–4 changes.
- No migration/versioning concerns — this is a build-time CSS file, not runtime state.
