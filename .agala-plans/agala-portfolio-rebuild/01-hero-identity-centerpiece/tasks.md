# Hero & Identity Centerpiece Tasks

## Implementation

- [x] Confirm sub-feature 00 has landed (token rename complete) before starting.
- [x] Read `components/chronometer/AgalaChronometer.client.vue` and `runtime/agala-chronometer.ts` one last time to extract the reusable patterns (quality-tier detection, canvas-text-texture technique, resize/render/dispose lifecycle) before deleting them.
- [x] Delete `components/chronometer/*` and `public/images/agala-chronometer-poster.webp`.
- [x] Define the derived node list (avatar + AlixPartners + Agala Labs + Smaltt + Kervo + Agala UI + Agala AI + Agala Setup) as a `computed()` inside the new component, mapping each real data record into `{ id, label, title, detail, href? }` — every `label` is now a direct reference to a real data field (`entry.company`, `product.name`, `project.title`), not a string literal, so doctrine compliance is mechanical rather than coincidental.
- [x] Build `components/constellation/runtime/agala-constellation.ts`: avatar loaded as a real texture via `THREE.TextureLoader`, 7 satellite discs with canvas-text labels arranged in a full circle (not just an arc — 7 real entities filled it out nicely), `THREE.Line` connectors, `setSelected(id)` brightens the selected node/line and dims the rest.
- [x] Build `components/constellation/AgalaConstellation.client.vue`: quality-tier detection (same pattern as prior centerpieces), real DOM readout panel + node-button row (`role="list"`/`role="listitem"`, `aria-pressed`), default selection on mount, reduced-motion/no-WebGL fallback poster path.
- [x] Update `components/workbench/WorkbenchHero.vue` and `pages/index.vue` to wire the new props (`products`, `projects` alongside existing `person`, `entries`).
- [x] Update `assets/css/main.css`: renamed `.chronometer-*` to `.constellation-*`, replaced range-input styling with a node-button-row styling block per `design.md`.
- [x] Update `tests/content.spec.ts`, `scripts/verify-workbench.mjs`, `scripts/validate-route-isolation.mjs` per `spec.md`.
- [x] (Found during implementation, not in original task list) The initial 7-node-circle geometry clipped the bottom node's label off the bottom edge of the canvas (a real layout bug, caught by screenshot review, not by any automated check). Root-caused via exact NDC projection math (wrote a throwaway Node script using the actual `THREE.PerspectiveCamera`/`Group` transforms rather than guessing) rather than continued trial-and-error: the bottom-most node's label offset compounded with its already-large distance from center, while top/side nodes' label offset happened to pull them back *toward* center. Fixed by shifting label offset from a fixed downward distance to a sideways offset that scales with how far south the node sits (`southing` factor) — full nodes keep the original below-disc placement, the exact-bottom node's label sits diagonally beside it instead of further beneath it. Verified all 7 labels fully visible with margin via the same NDC math before re-screenshotting.

## Verification

- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run test`
- [x] Start dev server; run the accessibility/interaction audit (`--audit` mode) and confirm the new node-button/readout contract passes.
- [x] Run the full visual sweep (320/390/768/1024/1440) at rest, plus at least one "node selected" screenshot at 1440.
- [x] Confirm reduced-motion pass: fallback poster present, node buttons and readout still fully functional without WebGL.
- [x] `npm run generate` + `npm run route:validate` to confirm the résumé bundle stays free of the new component's code.
- [x] Generate `public/images/agala-constellation-poster.webp` via the canvas-bounding-rect CDP screenshot technique.
- [x] **Stop here.** Present the built hero (screenshots at rest + selected state) to the owner and get explicit confirmation before starting sub-features 2–4, per `plan.md`'s Implementation Sequence and Risks. (Owner asked to implement all slices back-to-back rather than pause; proceeding per that instruction, but flagging this checkpoint clearly in the final report since this is the highest-risk slice.)

## Notes

- Do not bundle this with sub-features 2–4 in the same review pass — the whole point of isolating this slice is to catch a rejection early and cheaply, which earlier full-site passes this session did not do.
- If the owner rejects this concept too, do not immediately generate a fifth agent-invented alternative — per `plan.md`'s Open Questions, ask directly what object/detail the owner associates with his own work, rather than guessing again.
