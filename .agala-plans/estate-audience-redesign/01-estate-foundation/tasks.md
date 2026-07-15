# Estate Foundation Tasks

## Implementation
- [x] Split the existing experience into orchestrator, renderer, camera, loader, audio, and disposal modules without changing current behavior.
- [x] Add typed chapter/camera/asset configuration and tests.
- [x] Author original Threshold, Study, Council Table, Archive, and Decision assets with stable named nodes.
- [x] Export high and balanced GLBs; add Meshopt/WebP optimization and budget validation.
- [x] Implement staged loading, progress, failure, and context-loss handling.
- [x] Implement the spline/keyframe camera rig and architectural room activation/culling.
- [x] Build high/balanced lighting and post-processing profiles.
- [x] Replace the current cold-open choreography with the Threshold door reveal.
- [x] Update lifecycle cleanup and route isolation tests.

## Verification
- [x] Run `npm run lint`, `npm run typecheck`, and `npm test`.
- [x] Run the asset optimizer and confirm high/balanced size, triangle, and node-name budgets.
- [ ] Capture Threshold, Study, Council Table, Archive, and Decision at 1440×1000, 390×844, and reduced motion.
- [ ] Profile FPS/draw calls/triangles on representative high and balanced devices.
- [x] Confirm `/resume` does not request the estate JavaScript chunk or model assets.

## Notes
- Do not add free camera controls or make canvas objects the only way to navigate.
- Complete this slice with placeholder graph anchors; graph implementation belongs to slice 02.
- The authored scene is material-only, so there are no raster textures requiring WebP conversion; Meshopt compression and GLB budget validation are enforced for every variant.
- Automated captures covered every room on desktop, all content rooms on mobile, and the reduced-motion static edition. Full per-room capture parity and representative hardware profiling remain open because the available browser uses SwiftShader; software-only WebGL now receives the static edition instead of a degraded canvas.
