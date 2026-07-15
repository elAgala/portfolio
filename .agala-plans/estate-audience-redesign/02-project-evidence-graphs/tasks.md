# Project Evidence Graphs Tasks

## Implementation
- [x] Define shared graph types, validation, progress phases, and semantic label mapping.
- [x] Implement the instanced node/edge/pulse runtime with activation and disposal.
- [x] Build and visually approve the Agala UI blueprint graph.
- [x] Build and visually approve the Agala Deploy delivery topology.
- [x] Build and visually approve the Agala AI orchestration council.
- [x] Add synchronized `ProjectEvidenceCard` phase annotations and case-study links.
- [x] Add static final frames for balanced failure and reduced motion.
- [x] Add graph unit and integration tests.

## Verification
- [x] Verify every graph phase forward and backward with slow and fast scrolling.
- [x] Confirm project facts and node labels match `data/projects.ts`.
- [x] Capture all phases at desktop and mobile widths.
- [x] Confirm inactive graphs stop updating and combined budgets remain within limits.
- [x] Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run generate`.

## Notes
- “Technically meaningful” is an acceptance requirement: reject any graph revision that could be swapped between projects without changing its structure.
- Desktop and forced-high mobile captures cover all nine animated phases; production balanced mobile and reduced-motion captures cover the prescribed completed static frame.
- The heaviest active graph measured 42 draw calls and approximately 14.7k visible triangles; inactive graph update counts remain unchanged in integration tests.
