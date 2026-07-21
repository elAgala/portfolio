# Visual System Foundation Tasks

## Implementation

- [x] Read `assets/css/main.css` in full; list every `:root` custom property alongside its current value to identify exactly which names are mismatched (expect: `--navy*`, `--cobalt*`, `--bone`).
- [x] Rename mismatched tokens and every call site in one pass (`--navy`→`--ink`, `--navy-deep`→`--ink-deep`, `--navy-raised`→`--ink-raised`, `--cobalt`→`--wine`, `--cobalt-light`→`--brass`, `--bone`→`--paper` — note: `--navy`/`--bone` turned out to be exact-value duplicates of pre-existing `--ink`/`--paper`, so those two were merged/deduped rather than given a new distinct name; `--paper-bright` wasn't needed).
- [x] Grep-confirm zero remaining references to old names (see `spec.md` command).
- [x] Grep-confirm zero usages of `RevealOnScroll` / `SectionHeading` outside their own files, then delete both files.
- [x] Create or open `CLAUDE.md` at repo root; add the "Personal-Iconography Doctrine" section verbatim from `design.md`.
- [x] Re-read `.section-intro` / `.section-intro--compact` rules to confirm the single-column fix from this session is intact (no 3-column `grid-template-columns` regressions).
- [x] (Found during implementation, not in original task list) Removed five empty leftover directory husks from earlier redesign rounds: `components/chapters/`, `components/desk/`, `components/experience/`, `components/kernel/`, `components/terminal/` — confirmed empty via `find -type f` before removal.

## Verification

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run test`
- [x] Start dev server; run `node scripts/verify-workbench.mjs <url> <debugPort>` for the full screenshot sweep; visually compare against pre-change screenshots at 320/390/768/1024/1440 — expect zero visual difference. (Confirmed pixel-identical at 1440-top; rename is non-visual as expected.)
- [x] Run the `--audit` mode of the same script; confirm no new accessibility or overflow failures.
- [x] `npm run generate` + `npm run route:validate` to confirm the résumé bundle still contains no portfolio-only chunks (unaffected by this slice, but cheap to reconfirm before building on top of it).

## Notes

- This slice must land and be verified **before** sub-feature 1 starts, since sub-feature 1 deletes `components/chronometer/*` and will conflict with an in-flight token rename if done concurrently.
- Keep this as its own commit — no content/copy changes bundled in, so any regression is trivially attributable.
- Do not touch anything under `.resume-*` selectors or `pages/resume.vue` — frozen per owner instruction.
