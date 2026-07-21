# Hero & Identity Centerpiece Technical Spec

## Scope

Delete `components/chronometer/*` and `public/images/agala-chronometer-poster.webp`. Add `components/constellation/AgalaConstellation.client.vue` + `components/constellation/runtime/agala-constellation.ts` + `public/images/agala-constellation-poster.webp`. Update `components/workbench/WorkbenchHero.vue` to import the new component. Update `assets/css/main.css` (rename `.chronometer-*` classes to `.constellation-*`, add node-button-row styles). Update the three files that encode the current centerpiece's identity in tests/scripts: `tests/content.spec.ts`, `scripts/verify-workbench.mjs`, `scripts/validate-route-isolation.mjs`.

## Files And Modules

| Path | Change |
| --- | --- |
| `components/chronometer/*` | Delete entirely |
| `public/images/agala-chronometer-poster.webp` | Delete |
| `components/constellation/AgalaConstellation.client.vue` | Create — Vue wrapper: props `{ person: Profile, entries: CareerEntry[], products: ProductProof[], projects: Project[] }` (passed from `WorkbenchHero.vue`, threaded from `pages/index.vue` same as today), quality-tier selection via `chooseHeroSceneQuality`, real DOM node-button row + readout, lazy-imports runtime |
| `components/constellation/runtime/agala-constellation.ts` | Create — Three.js scene: avatar-textured `PlaneGeometry`/`CircleGeometry` at center via `THREE.TextureLoader`, N satellite node discs with canvas-text labels (reuse the exact canvas-texture technique from the deleted chronometer's monogram code before it's removed — copy the pattern, not the file), `THREE.Line` connectors, exposes `setSelected(id: string)`, `resize()`, `render()`, `dispose()` matching the existing runtime interface shape (`AgalaChronometerRuntime`-equivalent, renamed) |
| `components/workbench/WorkbenchHero.vue` | Swap import/usage from `AgalaChronometer` to `AgalaConstellation`; add whatever new props it needs (products/projects) alongside the existing `person`/`entries` props |
| `pages/index.vue` | Thread `productProofs` and `projects` (already imported here for the Products/Work sections) down into `WorkbenchHero` as new props |
| `assets/css/main.css` | Rename `.chronometer-experience`/`.chronometer-stage`/`.chronometer-fallback`/`.chronometer-controls`/`.chronometer-readout*`/`.chronometer-scrub*`/`.chronometer-hint` to `.constellation-*` equivalents; replace the range-input styling block with a node-button-row styling block (reuse `.agala-button`-family visual language per `design.md`) |
| `types/portfolio.ts` / `types/workbench.ts` | No new types expected — `ProductProof`, `Project`, `CareerEntry` already exist with the fields this concept reads |
| `tests/content.spec.ts` | Update the file-path reference in the "contains no decorative status theater" test (`components/chronometer/AgalaChronometer.client.vue` → `components/constellation/AgalaConstellation.client.vue`) and the describe block name |
| `scripts/verify-workbench.mjs` | Replace the chronometer-specific contract check (range input, "TIME'S UP" text) with a constellation-specific one: assert the node-button row exists, assert clicking a node button updates the readout text to that entity's real name, assert the reduced-motion fallback still exposes the same functional buttons |
| `scripts/validate-route-isolation.mjs` | Update `forbiddenMarkers` from `['agala-chronometer', 'AgalaChronometer', ...]` to `['agala-constellation', 'AgalaConstellation', ...]` |

## Data Model

No new data files or schema changes. Reads existing:
- `data/profile.ts`: `profile.avatar`, `profile.name`
- `data/career.ts`: `careerEntries` (filter/find by `company` for AlixPartners/Agala Labs nodes)
- `data/lab.ts`: `productProofs` (Smaltt, Kervo)
- `data/projects.ts`: `projects` (Agala UI, Agala AI, Agala Setup)

Recommend defining the node list as a small derived array inside `AgalaConstellation.client.vue` (a `computed()`), mapping each of the above real records into a uniform `{ id, label, detailTitle, detailBody, href? }` shape for the runtime and the readout — do not create a new persisted data file for this; it is a presentation-layer projection of existing data, same pattern already used by the chronometer's `timeline` computed().

## API Contract

Not applicable — static site, no API routes.

## Frontend State

- `selectedId: Ref<string>` — currently selected node id, defaults to the first entity so the readout is never empty on load.
- `quality: Ref<HeroSceneQuality>` — unchanged pattern from every prior centerpiece.
- Runtime exposes `setSelected(id: string)` instead of the chronometer's `setProgress(value: number)` — a discrete selection rather than a continuous scrub, reflecting the discrete-node nature of this concept.

## Backend Flow

Not applicable — no backend in this repo.

## Permissions And Validation

None beyond the existing WebGL-availability / reduced-motion detection already implemented in every prior centerpiece (`webglAvailable()`, `window.matchMedia('(prefers-reduced-motion: reduce)')`) — copy that detection code unchanged.

## Observability

Not applicable.

## Tests

- Unit/content (`tests/content.spec.ts`): update path reference as above; add (optional but recommended) an assertion that every node label used by the constellation's derived data matches a real `company`/`name` field already present in `careerEntries`/`productProofs`/`projects` — this directly encodes the Personal-Iconography Doctrine as an automated check for this one component, which is the closest an automated test can get to catching "did we invent something."
- Accessibility/interaction audit (`scripts/verify-workbench.mjs --audit`): assert the node-button row exists and each button is a real, named, focusable control (reuse the existing `assertAccessibility()` helper — no new helper needed); assert selecting each node updates the readout text to a non-empty value that includes that node's label; assert the reduced-motion fallback still exposes the same buttons and they still update the readout (interaction must not depend on WebGL).
- Route isolation (`scripts/validate-route-isolation.mjs`): update forbidden markers as above; must still pass (résumé bundle must not contain the constellation's Three.js code).
- Visual: full screenshot sweep at 320/390/768/1024/1440, at rest and with each node selected at least once at 1440, captured via the existing `scripts/verify-workbench.mjs` pattern (extend the per-viewport capture loop the same way it currently captures one "scrubbed" state, but capture one "selected" state per node, or at minimum one representative selection, to keep the sweep fast).
- Manual/qualitative: owner reviews the built hero screenshot and confirms every visual element traces to something real (see `prd.md` Acceptance Criteria) before sub-features 2–4 begin.

## Rollout Notes

- This is the highest-risk slice in the plan (see `plan.md` Risks). Build and get sign-off on this slice alone before starting 2–4, even though 2–4 don't technically depend on it, specifically so a rejection is caught in isolation rather than after a full-site pass.
- Delete `components/chronometer/*` in the same commit as adding `components/constellation/*` (matches how `components/puzzle/*` and `components/signal/*` were removed in-step with their replacements earlier this session) — do not leave both trees present simultaneously.
- Regenerate `public/images/agala-constellation-poster.webp` after the runtime is visually finalized, using the same headless-Chrome-plus-CDP-screenshot technique used for every prior fallback poster (capture the canvas element's bounding rect specifically, not a full-page screenshot, to avoid the DPR/compositing pitfalls already diagnosed and worked around this session).
