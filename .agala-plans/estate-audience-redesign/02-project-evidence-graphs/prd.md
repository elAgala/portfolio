# Project Evidence Graphs PRD

## Problem
The existing project objects are attractive symbols but do not explain how the projects work. Generic panels and orbit rings miss the opportunity to demonstrate architecture, systems thinking, and real engineering outcomes.

## Users
- Engineering leader: needs to understand each project’s boundaries and value within seconds.
- Senior engineer: wants technically honest structure rather than vague visual metaphors.
- Recruiter: needs a concise visual hook plus a direct case-study link.

## Goals
- Give every featured project a unique, technically meaningful 3D graph.
- Make scroll progression reveal inputs, transformations, and outcomes in a readable order.
- Keep detailed labels and actions in semantic HTML while the graph supplies spatial understanding.

## Non-Goals
- Full code explorers, live production telemetry, editable node graphs, or canvas-only tooltips.
- Invented metrics or architecture not supported by the existing project data.

## User Stories
- As an engineering leader, I want to see the system boundary and flow, so that I can judge the work before opening the case study.
- As a keyboard user, I want the same project explanation outside the canvas.
- As a mobile user, I want a focused graph state rather than a cropped desktop composition.

## Functional Requirements
1. Define nodes, edges, groups, phases, labels, and outcomes for all three projects in typed data.
2. Animate graph state from each project’s local scroll progress, including reversible forward/backward motion.
3. Use instancing and shared materials for repeated nodes; do not create one mesh/material per repeated graph element.
4. Synchronize graph phases with visible HTML annotations and chapter labels.
5. Provide a static representative frame for balanced/reduced-motion/fallback tiers.

## Acceptance Criteria
- Given Agala UI, when the chapter progresses, then tokens visibly feed primitives, primitives compose patterns, and patterns assemble the final interface plane.
- Given Agala Deploy, when the chapter progresses, then CI input, encrypted secrets, inventory, runtime, and target servers activate in their real order with a visible success state.
- Given Agala AI, when the chapter progresses, then product, architecture, implementation, QA, and repair roles exchange work through stack contracts and return to a completed loop.
- Given a graph is not active, then its expensive animation and shader updates are paused.
- Given reduced motion, then the final graph state appears without animated traversal.

## Metrics
- A reviewer can correctly describe the purpose and broad flow of each project after viewing its chapter for 10 seconds.
- All three graph chapters stay within the shared high/balanced draw-call and triangle budgets.
- No graph label depends on canvas text for accessibility or SEO.

## Dependencies
- Stable Council Table anchors and camera framing from Estate Foundation.
- Existing verified project content from `data/projects.ts`.
