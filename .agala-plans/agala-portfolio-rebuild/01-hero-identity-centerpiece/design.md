# Hero & Identity Centerpiece Design

## UX Intent

The hero should read, in order, as: (1) this is a real specific person — his actual face, large and in color; (2) this person's work has real shape — a practice, an employer, specific shipped products, specific open-source tools; (3) you can explore that shape yourself in a few clicks. Optimized for "trust and orient in 10 seconds, explore for 20 more if curious" — not for a long onboarding narrative.

## Concept: "The Practice" — a real relationship graph centered on the avatar

Not a metaphor, not an invented instrument. A literal, labeled map of Julián's real professional relationships, styled as a constellation: his avatar sits at the visual center; six real entities orbit around it; brass lines connect the avatar to each; selecting one brings it forward and shows its real description. Every label is text that already exists in `data/*.ts`.

Real nodes (exact source, no invention):
- **Center:** Julián's avatar (`profile.avatar`, `julian-portrait.webp`), full color.
- **AlixPartners** — from `career.ts` entry `{ company: 'AlixPartners', ... }` (employer).
- **Agala Labs** — from `career.ts` entry `{ company: 'Agala Labs', ... }` (his independent practice).
- **Smaltt** — from `lab.ts` `productProofs[0]` (shipped product).
- **Kervo** — from `lab.ts` `productProofs[1]` (shipped product).
- **Agala UI** — from `projects.ts` (open-source repo).
- **Agala AI** — from `projects.ts` (open-source repo).
- **Agala Setup** — from `projects.ts` (open-source repo).

That is seven satellite nodes plus the center; if seven feels visually crowded at small viewports, `Agala UI`/`Agala AI`/`Agala Setup` may be grouped into one "Open work" satellite that expands to the three on selection — see Responsive behavior below. This is still doctrine-compliant (the group label "Open work" already exists as the section heading eyebrow in `pages/index.vue`).

## Layout

- **Desktop:** unchanged two-column hero grid (`.agala-hero`) — copy column left (untouched: kicker, `AGALA`, statement, summary, CTAs, availability line), centerpiece column right. Centerpiece column contains: the canvas/fallback stage on top (existing `.chronometer-stage`-equivalent sizing, ~26rem min-height), a real-text readout panel below it, and a row/grid of real labeled node buttons below that (replaces the range-input scrub control — this concept is explored by selection, not by dragging a single continuous value).
- **Mobile:** stage stacks full-width above the node button grid, same as prior centerpieces' responsive pattern (min-height steps down at 980px/760px breakpoints per existing `.chronometer-stage`/`.chronometer-stage canvas` responsive rules, renamed to match the new component).

## Visual Hierarchy

1. Avatar at the compositional center — largest, most detailed (real photo texture), always in focus.
2. The six/seven satellite nodes — smaller brass-toned discs with a real name label (rendered via canvas-text-texture on each node, same technique already proven for the chronometer's engraved "A" monogram), arranged in a gentle arc/orbit around the avatar, connected to it by thin brass `THREE.Line` segments (same primitive already used successfully in the puzzle and chronometer builds).
3. The readout panel (real DOM text, same visual treatment as the existing `.chronometer-readout` block: bordered panel, monospace title + detail lines) — shows the selected entity's real description.
4. The node button row (real DOM buttons/links, one per entity, labeled with the real name) — the actual accessible control surface.

## Component Plan

| Area | Component | Details |
| --- | --- | --- |
| Hero shell | `components/workbench/WorkbenchHero.vue` | Swap `AgalaChronometer` import for the new component; copy column unchanged |
| 3D centerpiece | `components/constellation/AgalaConstellation.client.vue` (name TBD at implementation, must describe the concept — no leftover instrument name) | Client-only, lazy-imports its runtime the same way every prior centerpiece has (`await import('./runtime/...')` inside `onMounted`, gated by `quality.value !== 'fallback'`) |
| 3D runtime | `components/constellation/runtime/agala-constellation.ts` | Three.js scene: avatar-textured circular plane at center, satellite nodes as small discs with canvas-text labels, `THREE.Line` connectors, camera pan/focus driven by `setSelected(id)` |
| Node controls + readout | Real DOM, inside the same `.client.vue` file's `<template>` | A `<div role="list">`/button group (one real `<button>` per entity) below the stage, plus a readout panel above the buttons, same structural pattern as the chronometer's `.chronometer-controls` |

## Interaction Details

- Default/idle state: no entity selected (or the first-listed entity selected by default so the readout is never empty); scene idles with a very slow ambient rotation (same idle-jitter-via-rAF pattern already used, just simpler: a slow `root.rotation.y` drift, paused entirely under reduced motion).
- Selecting a node (click/tap on its real DOM button, or `Enter`/`Space` when focused): (a) updates the readout panel to that entity's real description text; (b) the 3D scene brings that node's line to full brass brightness and dims the others slightly (simple per-line-material color/opacity change, no new geometry); (c) optionally, if the entity corresponds to an existing on-page section anchor (e.g. Smaltt/Kervo → `#products`, Agala UI/AI/Setup → `#work`, AlixPartners/Agala Labs → `#experience`), the button is a real `<a href="#section">` so keyboard/screen-reader users get real navigation, not just a decorative highlight — this makes the centerpiece functionally useful, not just decorative.
- No drag interaction is required for this concept (unlike the puzzle/chronometer's drag mechanic) — selection is via discrete real controls, which is more robust for accessibility and avoids the geometry-fragility that caused visible bugs in the two prior hinge/exit-vector-based builds.

## States

- **Loading:** identical pattern to prior centerpieces — canvas hidden until `quality` tier resolves in `onMounted`; no layout shift because the stage container has a fixed `min-height` regardless of tier.
- **Empty:** not applicable — a default entity is always selected on mount, so the readout is never blank.
- **Reduced motion / no WebGL (fallback tier):** static poster image (`agala-constellation-poster.webp`, generated the same way prior fallback posters were captured via headless Chrome + CDP screenshot) replaces the canvas; the real node buttons and readout remain fully present and functional — selecting a node still updates the readout text, it just doesn't animate the (absent) 3D scene.
- **Error:** if `julian-portrait.webp` fails to load as a texture, the center node falls back to a plain brass disc with the "A" canvas-text monogram (same technique as the chronometer lid) rather than a broken-texture render.

## Copy

- Hint line (replaces the chronometer's "Drag to wind the watch..."): `"Select a node to see how the practice connects."` (or equivalent — must accurately describe a click/select interaction, not a drag one, since this concept doesn't drag).
- Readout panel title: the entity's real name + role/category (e.g. `"Smaltt — Dental software"`, `"AlixPartners — Software Engineer / Tech Lead"`), pulled from existing data fields, not newly authored.
- Readout panel detail: the entity's existing `description`/`contribution` (products), `outcome`/`description` (projects), or `portfolioSummary` (career) field — reuse verbatim, do not paraphrase into new copy for this slice.
- No joke/easter-egg copy is required for this concept (the previous "404 SIGNAL LOST" / "TIME'S UP" gags were fun but are not necessary here — this concept's payoff is the real information itself). If an easter egg is still wanted, it must also satisfy the doctrine (e.g., selecting the avatar node itself could surface a real, true one-line fact rather than a fabricated joke) — treat as optional, not required for acceptance.

## Styling Notes

- Reuse the existing brass/ink/wine token set (post-rename from sub-feature 00: `--brass`, `--ink`, `--wine`, `--paper`) — no new colors.
- Reuse the existing `.chronometer-readout`-equivalent panel styling (bordered box, monospace type) for the new readout, renamed to match the new component.
- Node buttons should look like a deliberate control row (bordered, monospace labels, brass hover/focus state), not a plain unstyled list — reuse the existing `.agala-button`-family visual language where reasonable rather than inventing a third button style.
- Keep the existing adaptive pixel-ratio/quality-tier logic (`resize()`/`renderer.setPixelRatio(...)`) unchanged from prior runtimes — this part of the prior implementations was never the problem.
- Avoid the specific geometry risk classes that caused bugs in prior builds: no hinge rotation math (chronometer lid), no exit-vector tuning requiring multiple visual-iteration passes (puzzle pieces). This concept's riskiest geometry is "position N small discs in an arc and draw a line to each," which is materially simpler and lower-risk than either prior build.
