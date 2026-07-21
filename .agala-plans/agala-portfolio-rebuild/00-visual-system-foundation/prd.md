# Visual System Foundation PRD

## Problem

The site's visual language is currently correct (warm ink/paper/wine/brass, approved this session) but the CSS that implements it is confusing to maintain: custom properties are still named `--navy`, `--cobalt`, `--cobalt-light`, `--bone` even though they hold warm dark/wine/brass values, a leftover from an earlier blue-palette era. Separately, there is no written rule stopping the next content or design pass from re-introducing an invented, disconnected visual metaphor (the exact failure mode that produced four rejected hero concepts this session). Both problems compound: without a legible token system and a written doctrine, every future change re-derives taste from scratch instead of checking against a standard.

## Users

- **Julián (site owner / reviewer):** needs to be able to look at any future change and check it against a written standard ("does this trace to something real?") instead of re-explaining taste every time.
- **Whoever edits this CSS next (human or agent):** needs token names that describe what they hold, not what they held two redesigns ago.

## Goals

- Token names match token values (no more warm colors living in variables named after cool ones).
- A written, checkable doctrine exists (Personal-Iconography Doctrine, promoted from `plan.md` into this repo's own `CLAUDE.md` or an equivalent durable location) that future passes must satisfy.
- The `.section-intro` header pattern (eyebrow + heading + description) is confirmed bug-free and documented as the standard section-header component for reuse.
- Dead code (`components/RevealOnScroll.client.vue`, `components/SectionHeading.vue`) is removed.

## Non-Goals

- No new colors, no new fonts, no new section layouts — this slice is a rename/cleanup/documentation pass, not a redesign. Visual output should be pixel-identical before/after except where an existing bug is fixed.
- Does not touch `pages/resume.vue` or resume-scoped CSS rules (`.resume-*`) — explicitly frozen.

## User Stories

- As the site owner, I want a written rule that rejects invented-metaphor centerpieces, so that I don't have to reject the same failure mode a fifth time.
- As a future editor of this CSS, I want `--wine` to hold a wine color, so I don't have to open the file to discover what `--cobalt` actually renders as.

## Functional Requirements

1. Rename CSS custom properties in `assets/css/main.css` `:root`: `--navy` → `--ink`, `--navy-deep` → `--ink-deep`, `--navy-raised` → `--ink-raised`, `--cobalt` → `--wine`, `--cobalt-light` → `--brass`, `--bone` → `--paper-bright` (exact final names may be adjusted during implementation for internal consistency, but must describe the actual color). Every `var(--old-name)` usage across the stylesheet must be updated in the same pass — zero remaining references to the old names outside of resume-scoped rules, which already use hardcoded plain colors and are out of scope.
2. Confirm the `.section-intro` fix (single-column flow, no 3-column grid auto-placement) from this session is complete and correct at all five audited breakpoints (320/390/768/1024/1440) with no orphaned empty grid cells.
3. Remove `components/RevealOnScroll.client.vue` and `components/SectionHeading.vue` (confirmed zero imports repo-wide via grep before deletion).
4. Write the Personal-Iconography Doctrine as a short, durable checklist in this repo's `CLAUDE.md` (create if absent) so it persists across sessions, not just in `.agala-plans/`.

## Acceptance Criteria

- Given the renamed tokens, when `grep -n "\-\-navy\|\-\-cobalt\|\-\-bone" assets/css/main.css` is run, then it returns zero matches.
- Given the full site rebuilt after the rename, when compared against pre-rename screenshots at all five breakpoints, then visual output is unchanged (rename is non-visual).
- Given `components/RevealOnScroll.client.vue` and `components/SectionHeading.vue` deleted, when `npm run lint` / `npm run typecheck` / `npm run test` run, then all pass with no missing-import errors.
- Given the doctrine written to `CLAUDE.md`, when a future session reads it, then it can check a proposed hero concept against the checklist without re-deriving the reasoning from this plan.

## Metrics

- Zero legacy-named token references after rename (grep-verifiable, can be wired into `scripts/validate-route-isolation.mjs`-style CI check if desired, not required for this slice).
- Zero unused component files after cleanup.

## Dependencies

- None — this is the first slice per `plan.md`.
