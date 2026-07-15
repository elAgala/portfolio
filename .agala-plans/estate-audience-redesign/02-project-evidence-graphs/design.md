# Project Evidence Graphs Design

## UX Intent
Each project should feel like evidence being demonstrated across the council table: elegant enough to belong in the estate, precise enough to teach the architecture, and distinct enough to remain memorable.

## Layout
- Desktop: graph occupies the table-side 55–62% of the frame; a restrained HTML evidence card occupies the opposing safe zone. Camera moves around the same table to establish continuity.
- Mobile: graph is centered in the upper 48–55svh; project copy follows in normal document flow. Only the active graph phase is emphasized.

## Visual Hierarchy
1. Current system transformation or active flow.
2. Project name and one-sentence outcome.
3. Stack, year, phase annotation, and case-study link.

## Component Plan
| Area | Component | Details |
| --- | --- | --- |
| Shared graph runtime | `EvidenceGraph.ts` | Applies local progress, activation, instancing, edge pulses, and disposal. |
| UI graph | `AgalaUiGraph.ts` | Exploded dependency architecture on an illuminated drafting table. |
| Deploy graph | `AgalaDeployGraph.ts` | Miniature delivery topology with vault, inventory, runtime, and target nodes. |
| AI graph | `AgalaAiGraph.ts` | Suspended orchestration network with specialist roles and stack-contract rings. |
| HTML annotation | `ProjectEvidenceCard.vue` | Title, outcome, active phase summary, stack, and case-study link. |

## Interaction Details
- **Agala UI — The Blueprint:** a rolled blueprint opens; token chips illuminate along the bottom; lines rise to primitives; primitives assemble into composite components; the final interface locks into a clean grid. Phase copy: “Tokens establish the language” → “Typed primitives hold behavior” → “Workflows assemble without drift.”
- **Agala Deploy — The Operation:** a Woodpecker CI token enters; a brass vault decrypts only the required secret path; inventory selects an environment; the containerized runtime rotates into position; packets travel to server towers; a final green status line appears. Phase copy mirrors the actual CI/SOPS/inventory/Ansible flow.
- **Agala AI — The Council:** specialist role nodes sit around a dark-glass core; stack contracts form outer rings; a work token moves PM → architecture → implementation → QA → repair and back to completion; inactive roles dim rather than disappear.
- Pointer hover on high tier may subtly isolate a node group, but the card copy and case-study link remain the only required interaction.
- Scrolling backward reverses graph construction cleanly; no particles remain orphaned.

## States
- Loading: table anchor and graph silhouette are visible; HTML card is complete.
- Error: show a static blueprint/topology/constellation still and keep the full project card.
- Reduced motion: show the final assembled graph state with phase copy fixed to the outcome.
- Success: graph settles into a quiet idle state rather than looping continuously.

## Copy
- Agala UI outcome label: “A reusable product language.”
- Agala Deploy outcome label: “A repeatable path to production.”
- Agala AI outcome label: “Delivery roles made explicit.”
- Primary action: “Examine the case.”

## Styling Notes
- Graphs inherit estate materials: parchment/oxblood for UI, blackened steel/brass for Deploy, smoked glass/brass for AI.
- Use emissive accents only for active flow; inactive structure stays materially lit.
- Avoid generic dashboard cards inside 3D, random orbiting dots, rainbow node colors, and decorative labels too small to read.
