# Project Evidence Graphs Technical Spec

## Scope
Create three data-driven, progress-controlled Three.js graph systems mounted at Council Table anchors and synchronized with semantic project cards.

## Files And Modules
| Path | Change |
| --- | --- |
| `data/experience-graphs.ts` | Add typed nodes, edges, phases, annotations, and material roles for each project. |
| `components/experience/graphs/` | Add shared runtime plus UI, Deploy, and AI graph factories. |
| `components/ProjectEvidenceCard.vue` | Replace the current framed project card with synchronized editorial evidence copy. |
| `types/experience.ts` | Add graph, node, edge, phase, and runtime interfaces. |

## Data Model
- `EvidenceGraphDefinition`: `id`, `nodes`, `edges`, `phases`, `materialTheme`, `staticCameraFrame`.
- `EvidenceNode`: stable id, accessible label, kind, group, position, scale, metadata reference.
- `EvidenceEdge`: source/target ids, direction, style, activation phase, pulse duration.
- `EvidencePhase`: local start/end, annotation, active node/edge groups, camera emphasis.
- Node labels used in HTML must come from the same definition to prevent canvas/copy drift.

## API Contract
No backend API. Fact content continues to come from local typed project data.

## Frontend State
- Estate runtime supplies active graph id and normalized local chapter progress.
- Each graph exposes `setProgress(progress)`, `setQuality(tier)`, `setActive(active)`, and `dispose()`.
- Use `InstancedMesh` for repeated nodes and `LineSegments2`/shared buffer geometry for edges; update matrices/colors in batches and mark attributes dirty once per frame.
- Pause graph update callbacks outside their activation ranges.

## Backend Flow
Not applicable.

## Permissions And Validation
- Build-time validation rejects missing node ids, dangling edges, overlapping phase ranges, or graph annotations without semantic labels.
- Project graph facts must map to existing repository evidence; no unverified usage numbers or performance claims.

## Observability
- Development overlay reports per-graph draw calls, triangle counts, active instances, and update time.
- Log graph construction errors once and fall back to the corresponding static frame.

## Tests
- Unit: graph schema validation, phase interpolation, reverse progress, edge activation, and node-label parity.
- Integration: scene anchor binding, active/inactive update behavior, quality switching, and graph disposal.
- UI/E2E/manual: screenshot every phase, verify case-study navigation, compare desktop/mobile compositions, and test reduced motion.

## Rollout Notes
- Implement and approve Agala UI first as the reference graph pattern, then Deploy, then AI.
- Do not enable all three in production until combined runtime stays within the estate budgets.
