# Visual System Foundation Design

## UX Intent

Invisible to visitors — this slice is entirely about making the codebase legible to whoever touches it next, and about writing down a standard that prevents the specific failure mode (invented, disconnected hero metaphors) that has driven four rejected passes. No visitor-facing behavior should change.

## Layout

Not applicable — no layout changes in this slice.

## Visual Hierarchy

Not applicable.

## Component Plan

| Area | Component | Details |
| --- | --- | --- |
| Design tokens | `assets/css/main.css` `:root` block | Rename in place, keep the same cascade order and grouping (ink/paper/wine/brass, then muted/line, then font/layout vars) |
| Section headers | `.section-intro` / `.section-intro--compact` | No changes beyond confirming the existing single-column fix; document as "the" section header pattern other sub-features must reuse rather than inventing a new header treatment per section |
| Dead components | `components/RevealOnScroll.client.vue`, `components/SectionHeading.vue` | Delete files entirely |

## Interaction Details

None — no interactive elements in this slice.

## States

Not applicable.

## Copy

### Personal-Iconography Doctrine (to be written into `CLAUDE.md`)

```markdown
## Personal-Iconography Doctrine

Any visual element, metaphor, or interactive centerpiece on the portfolio homepage
must trace to one of:

1. A real row in `data/profile.ts`, `data/lab.ts`, `data/projects.ts`, or `data/career.ts`.
2. A real image asset already committed under `public/images/`.
3. A real external URL (a GitHub repo under github.com/elAgala, or a live product
   under *.agala.com.ar).

If a proposed visual cannot be traced to one of the above, it does not ship,
no matter how polished or "engineer-coded" it looks. This rule exists because four
prior hero centerpieces (operator desk, puzzle box, oscilloscope, pocket watch) were
each internally consistent, accessible, and lint/typecheck/test-clean, and were still
rejected as generic — because each was an invented analogy ("engineers value X, so:
object that represents X") rather than something literally true about the site owner.

When in doubt: prefer showing a real screenshot, a real repo, or the real avatar over
inventing a new object.
```

## Styling Notes

- Token rename is mechanical: for each `--old-name`, `sed`/find-replace both the `:root` declaration and every `var(--old-name)` call site in the same commit. Do this as its own commit/diff, separate from any content or layout change, so a visual regression (if any slips through) is trivially attributable to the rename and not tangled with unrelated edits.
- Do not touch the resume-scoped rules (`.resume-*`, `@layer print`) — they intentionally use hardcoded plain black/white/gray values, not theme tokens, per the frozen-résumé decision.
- After rename, re-run the full screenshot sweep (320/390/768/1024/1440, plus the reduced-motion pass) and diff visually against the pre-rename screenshots already captured this session (or freshly captured ones) to confirm zero visual drift.
