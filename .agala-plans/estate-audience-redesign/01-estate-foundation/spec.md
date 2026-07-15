# Estate Foundation Technical Spec

## Scope
Replace the monolithic procedural desk scene with a modular multi-zone Three.js world, typed camera choreography, staged asset loading, and enforceable rendering tiers.

## Files And Modules
| Path | Change |
| --- | --- |
| `components/experience/EstateExperience.client.vue` | Replace the current orchestrator with a thin lifecycle/state shell. |
| `components/experience/runtime/` | Add renderer, world, camera rig, asset loader, audio, quality, and disposal modules. |
| `data/experience.ts` | Add typed chapters, camera keyframes, asset manifests, and room activation ranges. |
| `public/models/estate-*.glb` | Add optimized original high and balanced environment assets. |
| `scripts/optimize-scene.mjs` | Validate/optimize exported GLBs and report asset budgets. |

## Data Model
- `ExperienceChapterConfig`: `id`, `label`, `start`, `end`, `room`, `cameraKeys`, `htmlAlign`, `graphId?`.
- `CameraKeyframe`: normalized progress, position tuple, target tuple, FOV, optional roll, easing curve.
- `SceneAssetManifest`: high/balanced URLs, byte budget, required node names, preload priority.
- `ExperienceRuntimeState`: quality, load phase, load progress, active chapter, normalized progress, sound enabled, failure reason.
- Preserve the public `ExperienceChapter` and `ExperienceQuality` concepts; replace scalar `cameraX` with camera keyframes.

## API Contract
No backend API. GLBs and textures are static public assets loaded through `THREE.LoadingManager` and `GLTFLoader`.

## Frontend State
- Keep state local to the homepage experience; do not add Pinia.
- Emit `ready`, `progress`, `chapter-change`, and `fallback` from the canvas orchestrator to the shell.
- Load `estate-core-high.glb` or `estate-core-balanced.glb` after hydration, then lazy-load archive/detail assets before their activation ranges.
- Use `GLTFLoader.setMeshoptDecoder` for Meshopt-compressed GLB geometry. Three.js officially supports Meshopt, WebP, AVIF, and KTX2 extensions through `GLTFLoader`.

## Backend Flow
Not applicable.

## Permissions And Validation
- At build verification, assert required named model nodes: `Threshold`, `Study`, `CouncilTable`, `Archive`, `Decision`, and graph anchors.
- Reject optimized assets that exceed the configured high/balanced byte or triangle budgets.
- Validate all chapter ranges are ordered, non-overlapping where required, and cover progress 0–1.

## Observability
- Development-only HUD reports FPS, draw calls, visible triangles, renderer tier, and current camera keyframe.
- Production records no analytics by default. Console warnings are limited to one actionable asset or context failure.

## Tests
- Unit: quality selection, camera interpolation, chapter selection, asset-manifest validation, and direct-anchor behavior.
- Integration: staged load success/failure, context loss, resize, route teardown, tab visibility, and replay.
- UI/E2E/manual: desktop/mobile chapter screenshots, fast-scroll stability, keyboard navigation, reduced motion, and `/resume` isolation.

## Rollout Notes
- Keep the current scene behind a temporary local feature switch until Threshold, Study, and one graph station meet visual/performance targets.
- Production builds consume committed optimized GLBs; Blender is an authoring dependency only.
- Route-level code splitting must keep the estate chunk and model fetches off `/resume` and case-study initial loads.
