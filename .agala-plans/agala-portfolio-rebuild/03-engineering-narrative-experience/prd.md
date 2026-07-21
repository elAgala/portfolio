# Engineering Narrative & Experience PRD

## Problem

The Systems section (`engineeringDecisions`, 3 items) and the Experience section (`careerEntries`, 3 items) currently share the same visual skeleton: a numbered/dated full-width row, divided by horizontal borders, with a title + body text + a small tools/tags line. Scrolling from one to the other, nothing about the shape changes — only the words do. This is a milder instance of the same "same shit, another color" complaint that was already raised and partly fixed for the hero/products this session, and it has not yet been addressed for these two sections specifically.

## Users

- **Technical visitors:** use Systems to judge *how* Julián thinks about tradeoffs, and Experience to judge *what* he's actually done and when. These are different questions and should feel like different sections, not a repeated template with different words.

## Goals

- Experience reads unmistakably as a **chronology** (dates are the organizing axis).
- Systems reads unmistakably as **a small set of standing principles/tradeoffs**, not a numbered sequence (there is no real "01 happens before 02" relationship between the three engineering decisions — numbering them implies a false order).
- Both sections keep their existing real content (`engineeringDecisions.narrative`, `careerEntries.portfolioSummary`/`portfolioBullets`) — this is a layout/hierarchy differentiation pass, not a content rewrite (content was already de-templated from the CONTEXT/DECISION/TRADEOFF format earlier this session).

## Non-Goals

- Not changing the underlying data shape of `EngineeringDecision` or `CareerEntry` unless a real layout need requires a new field (unlikely).
- Not adding new engineering decisions or career entries — same three-and-three real records.
- Not touching the Products/Open-work sections (sub-feature 02) or the hero (sub-feature 01).

## User Stories

- As a visitor scanning quickly, I want the timeline shape of Experience to be visually obvious (a rail, dots, chronological flow), so that I can tell at a glance this is "career history in order."
- As a visitor reading Systems, I want it to feel like a short list of standing principles rather than a numbered procedure, so that I don't misread three independent tradeoffs as sequential steps.

## Functional Requirements

1. Remove the `01`/`02`/`03` index numbering from the Systems decision list (`pages/index.vue` `#systems`) — it implies a false sequence. Replace with a visual grouping that doesn't imply order (e.g., a 2-column card grid instead of a stacked numbered list — exact treatment specified in `design.md`).
2. Strengthen Experience's chronological read: add a visible connecting rail/line through the entry markers (currently just a dated row list with border dividers, no explicit "timeline" visual device) so the section's shape is unmistakably "history," not "list of facts."
3. Confirm neither section regresses the `.section-intro` header fix or the renamed tokens from sub-feature 00.

## Acceptance Criteria

- Given Systems and Experience are both visible in a single before/after comparison, when compared side by side, then their layouts are visually distinguishable at a glance (different silhouette), not just different text.
- Given the Systems section renders, when inspected, then no numbered index (`01`/`02`/`03`) implying sequence remains.
- Given the Experience section renders, when inspected, then a visible chronological device (rail/line/marker) connects the entries.
- Given all real content (`engineeringDecisions`, `careerEntries`) is unchanged, when the new layouts render, then no real information is lost or hidden.

## Metrics

- Qualitative: a reviewer scrolling from Systems to Experience should describe them as "different sections" without prompting, not "the same list twice."

## Dependencies

- Sub-feature 00 (token rename, `.section-intro` fix) should land first.
- Can run in parallel with sub-feature 02.
