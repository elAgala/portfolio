# Hero & Identity Centerpiece PRD

## Problem

The homepage hero needs an interactive centerpiece that a technical visitor remembers, and that Julián recognizes as *his* — not a portfolio template. Four prior attempts this session (operator desk, puzzle box, oscilloscope, pocket watch) were each technically sound (accessible, adaptive-quality, reduced-motion-safe) but were rejected because each invented a symbolic object with no real connection to Julián. Separately, his own commissioned illustrated avatar — the one asset in this repo that is unarguably, specifically his — has been under-used: shrunk to a small corner byline, and at one point desaturated to grayscale by mistake.

## Users

- **Technical hiring managers / peers (primary visitor):** spend 10–30 seconds on a portfolio hero. Need to immediately understand who this is, that the work is real (not a template), and get one reason to keep scrolling.
- **Julián (owner):** needs to look at the hero and recognize it as unmistakably about him — this is the acceptance bar that automated checks cannot verify, so it is written out explicitly below.

## Goals

- The hero centerpiece is provably traceable to real data (Personal-Iconography Doctrine from sub-feature 00) — every node/label in it corresponds to a real row in `data/*.ts` or a real external URL, nothing invented.
- Julián's real avatar (`julian-portrait.webp`, full color) is the visual anchor of the hero, not a small corner element.
- The centerpiece is genuinely interactive/explorable (the one thing the owner explicitly said he liked about the rejected attempts) and, unlike prior attempts, the exploration surfaces *real* information about his real career/practice rather than an abstract animation.
- Keeps the adaptive-quality tiering (`chooseHeroSceneQuality`) and the reduced-motion/no-WebGL static-poster-plus-real-controls fallback pattern already proven sound this session.

## Non-Goals

- Not building a game, not building a literal desk/room diorama, not inventing a new physical-object metaphor. If a concept can't be justified as "this is literally a true thing about Julián," it is out of scope for this slice.
- Not changing the rest of the hero copy (`"Hard problems. Clear software."`, summary, CTAs) — those were not flagged as a problem.
- Not re-opening the color palette (already approved).

## User Stories

- As a visitor, I want to see Julián's real face and real practice at a glance, so that I trust this is a real person with real, verifiable work, not a generated template.
- As a visitor, I want to explore how his real companies/projects relate to each other, so that I understand the shape of his practice (employed tech lead + independent Agala Labs + specific shipped products + specific open-source tools) without reading a paragraph.
- As Julián, I want the hero to be something only I could have, built from things that are actually true about me, so that it doesn't read as a portfolio template.

## Functional Requirements

1. Replace `components/chronometer/*` with a new component (working name: `AgalaConstellation`, final name should describe the actual concept) rendering a real-data node graph: Julián's avatar at the visual center, connected to real entities — `AlixPartners` (career entry, employer), `Agala Labs` (career entry, his practice), `Smaltt` and `Kervo` (`data/lab.ts` `productProofs`), `Agala UI`, `Agala AI`, `Agala Setup` (`data/projects.ts`). No invented entities, no invented connections beyond the real organizational relationships already stated in the data (employer, practice, product, open-source project).
2. Each node is reachable via a real, labeled, keyboard-operable control (button or link) rendered in the DOM alongside the canvas — not only via canvas raycasting — so the interaction is accessible by construction, matching the pattern already validated by the chronometer's native `<input type=range>` approach.
3. Selecting a node updates a real, visible (not just `aria-live`-only) text readout with that entity's real description, pulled directly from existing data fields (no new invented copy needed beyond what's already in `data/lab.ts` / `data/projects.ts` / `data/career.ts`).
4. The avatar is rendered in full color as a real image texture (loaded from `julian-portrait.webp`), sized and positioned as the clear visual anchor of the composition, not a small corner element.
5. Reduced-motion and no-WebGL visitors get a static poster image (same pattern as prior centerpieces) plus the same real, fully functional DOM controls and readout — the interaction/information is never gated behind WebGL.
6. Reuses `chooseHeroSceneQuality` from `utils/workbench.ts` for adaptive quality tiering, unchanged.

## Acceptance Criteria

- Given the hero renders, when a visitor inspects the DOM, then every node label matches text that also appears verbatim in `data/lab.ts`, `data/projects.ts`, or `data/career.ts` — no invented labels.
- Given a visitor selects any node control, when the selection changes, then the visible readout text updates to that entity's real description within one interaction (no page reload, no dead state).
- Given `prefers-reduced-motion: reduce` or no WebGL, when the hero renders, then the same real node controls and readout are present and functional, and a static poster image replaces the canvas.
- Given the owner reviews a screenshot of the built hero, when asked "is every visual element here something literally true about you," then the answer is yes for all of them (this is the acceptance bar automated tests cannot check — it must be confirmed by the owner before sub-features 2–4 begin, per `plan.md`'s Implementation Sequence).

## Metrics

- Zero invented labels/entities in the shipped hero (grep-verifiable against `data/*.ts`).
- Owner sign-off obtained on a screenshot before proceeding to sub-feature 2 (qualitative gate, not automatable — see Risks in `plan.md`).

## Dependencies

- Sub-feature 00 (token rename, doctrine) should land first so this slice is built against final token names.
- `data/lab.ts`, `data/projects.ts`, `data/career.ts`, `data/profile.ts` (all already exist with the needed real fields; no data changes required for this slice).
- `public/images/julian-portrait.webp` (already exists).
