# Engineering Narrative & Experience Design

## UX Intent

Systems should feel like a short list of standing beliefs you could recite; Experience should feel like a timeline you walk down. Different reading rhythm, different silhouette, same real content.

## Layout

### Systems (`#systems`) — becomes a 2-column card grid, not a numbered stacked list

- Desktop: `grid-template-columns: 1fr 1fr` (2 columns), 3 real items → 2 cards on row one, 1 card (spanning or left-aligned) on row two. Each card: title, narrative paragraph, tools line — same content as today, no index number.
- Mobile (≤760px): single column stack, cards full-width, same border/spacing language as other stacked content on the page (reuse existing spacing scale, don't invent a new one).
- Visual distinction from Experience: bordered **cards** (a rectangle with a full border, not just a bottom divider) rather than divider-separated rows — this alone is enough to read as "a different kind of list" (grouped items vs. a sequence).

### Experience (`#experience`) — becomes an explicit rail/timeline

- Desktop: keep the existing 3-column row grid (`dates | company+role | detail`) but add a visible vertical rail: a thin brass line running down the left edge of the list, with a small filled dot at each entry aligned to its `<time>` element. This is a CSS-only addition (a pseudo-element line + dot per `<li>`), not a new component.
- Mobile: rail collapses to a simple left-aligned line with dots stacked per entry (same technique, narrower).
- Visual distinction from Systems: the rail/dot device is unique to this section — nothing else on the page has a continuous connecting line, so it reads immediately as "this is the chronological one."

## Visual Hierarchy

**Systems cards**, per card:
1. Title (unchanged size/weight from current `.decision-list h3`)
2. Narrative paragraph (unchanged)
3. Tools line (unchanged `.technical-line` treatment)

**Experience rail**, per entry:
1. Date + rail dot (now the leading visual anchor, reinforced by the line)
2. Company/location + role title
3. Portfolio summary + bullets + stack line (unchanged content)

## Component Plan

| Area | Component | Details |
| --- | --- | --- |
| Systems | `pages/index.vue` `#systems` section markup, `assets/css/main.css` `.decision-list` rules | Change `<ol class="decision-list">` numbered-`<span>` markup to a card grid (`<div class="decision-grid">` or repurpose `.decision-list` as a grid — remove the `<span>0{{ index + 1 }}</span>` element entirely); update CSS from row-grid-with-divider to card-grid-with-border |
| Experience | `components/workbench/WorkbenchExperience.vue`, `assets/css/main.css` `.experience-list` rules | Add a rail: either a pseudo-element (`.experience-list::before` full-height line + `li::before` dot) or a thin absolutely-positioned div — pick whichever is simpler given the existing 3-column grid's left column width (`9rem` per current CSS), anchor the dot to align with the `<time>` element |

## Interaction Details

None — both sections remain static content, no new interactivity introduced.

## States

Not applicable — static content sections, no loading/empty/error states.

## Copy

No copy changes required — `engineeringDecisions[].narrative` and `careerEntries[].portfolioSummary`/`portfolioBullets` are reused verbatim. If the audit in sub-feature 02's spirit finds remaining AI-tell phrasing while implementing this layout change, fix it in the same pass rather than opening a separate task.

## Styling Notes

- Systems cards: border color/weight should read as *grouped items*, not *stacked rows* — full border on all four sides (`border: 1px solid var(--line)` post-rename), generous internal padding, gap between cards via `grid-gap`, not divider borders.
- Experience rail: brass line color (post-rename `var(--brass)` or `var(--line)` depending on how prominent it should read — err toward subtle, this is a wayfinding device not a decoration), dot should be a small filled circle (`border-radius: 50%`) sized to align visually with the `<time>` text baseline.
- Do not introduce a third distinct visual pattern beyond these two — the goal is exactly two silhouettes (card grid vs. rail list), not a proliferation of bespoke section styles that would itself become inconsistent.
