# The Audience: Estate Portfolio Redesign Plan

## Outcome
Replace the current lateral desk presentation with a continuous, original old-world estate journey that feels cinematic, technically meaningful, and unmistakably personal. The persistent Three.js canvas, scroll-directed structure, optional sound, semantic HTML, case studies, and formal résumé remain; the world, camera language, project visualizations, and editorial shell are redesigned.

The visitor crosses a threshold, enters the study, receives three pieces of technical evidence at a council table, reaches the archive/profile, and arrives at a final decision. The experience should evoke the gravity, restraint, shadows, ritual, and material language associated with *The Godfather* without copying its logo, characters, music, stills, quotations, or signature props.

## Repo Findings
- `components/PortfolioExperience.client.vue`: one 667-line client component currently owns procedural models, scene creation, camera interpolation, post-processing, sound, loading, and lifecycle cleanup. It proves the persistent-canvas concept but makes richer scene work difficult to author and test.
- `utils/experience.ts`: supplies three quality tiers and linear stage interpolation. The redesign needs camera keyframes, room activation ranges, chapter transition metadata, and graph state.
- `pages/index.vue`: the homepage already exposes semantic chapter markers and keeps the résumé/case-study routes separate. Preserve this SSR-accessible structure.
- `assets/css/main.css`: current cinematic overrides are appended to the original editorial styles, producing competing visual systems and very tall mobile chapters. Consolidate the homepage into one intentional responsive layer.
- `package.json`: Three.js and GSAP are already present. No `@el-agala/ui` package is installed.

## Sub-Features
| Order | Sub-feature | Boundary | Why independent | Depends on |
| --- | --- | --- | --- | --- |
| 1 | Estate Foundation | Persistent world, assets, camera rig, lighting, loading, quality tiers | Establishes the runtime and spatial language used by every later scene | None |
| 2 | Project Evidence Graphs | Three data-driven technical visualizations and their choreography | Can be built and reviewed against stable scene anchors without changing the page shell | Estate Foundation |
| 3 | Editorial Experience Shell | Homepage hierarchy, chapter copy, navigation, cold open, profile/archive, contact, fallbacks | Owns recruiter UX and accessibility independently from graph rendering | Estate Foundation, Project Evidence Graphs |

## Implementation Sequence
1. Build the estate asset/runtime foundation and prove the threshold-to-study camera path on desktop, mobile, reduced motion, and WebGL failure.
2. Implement each project graph from typed data, validating that it communicates the real project architecture before adding decorative polish.
3. Recompose the HTML/CSS shell around the final camera framing, then complete audio, fallbacks, route cleanup, visual regression, and performance QA.

## Shared Decisions
- Keep one persistent canvas and native vertical scrolling; replace the straight X-axis journey with chapter camera keyframes joined by a controlled spline.
- Use a hybrid asset pipeline: original glTF room architecture and hero props, plus procedural/instanced project graphs.
- The estate contains five connected zones: Threshold, Study, Council Table, Archive, Decision Doorway.
- Preserve the headline “Built with intent. Made to endure.” and all factual project/résumé content.
- Keep sound off by default, the intro skippable, résumé access visible immediately, and every essential action in semantic HTML.
- Do not use copied film assets, likenesses, dialogue, music, logo treatments, or literal recreations of recognizable scenes.
- Use direct Three.js rather than adding a second rendering abstraction. Add only build-time asset tooling required to optimize glTF.

## Agala UI Audit
| Need | Existing Agala UI component | Usage decision |
| --- | --- | --- |
| Site navigation and text links | Not installed | Keep custom semantic links; product-library controls would conflict with the editorial identity. |
| Sound and skip controls | Not installed | Keep native buttons with local accessible styling and 44px mobile hit areas. |
| Loading/fallback state | Not installed | Build a page-specific local component because it is tightly coupled to WebGL progress and art direction. |
| Project detail disclosure | Not installed | Keep information in visible HTML and case-study links; do not introduce modals or custom canvas controls. |

## Risks
- Authored 3D assets can inflate payload: commit separate high and balanced GLBs, use Meshopt-compressed geometry and WebP textures, and enforce budgets in verification.
- A multi-room scene can feel like a game instead of a portfolio: keep the visitor on a directed camera path and make project titles, outcomes, and résumé navigation continuously accessible.
- Heavy post-processing can damage readability and mobile performance: apply high-tier effects only to the canvas, never blur HTML, and disable ambient occlusion/bloom on balanced devices.
- Visual homage can become derivative: use original architecture and generic period materials; review every prop against the prohibited-reference list.
- Blender is not currently available in the repo environment: the implementation may install it only as an authoring prerequisite; production builds consume committed optimized GLBs and never depend on Blender.

## Assumptions
- The recommended Estate Journey + Audience narrative + Hybrid Custom World direction is approved.
- The existing portrait, project facts, case-study URLs, résumé route, and PDF remain authoritative.
- Original model creation and locally generated textures are allowed; stock asset downloads are not required.
- Desktop receives the full estate, balanced/mobile receives simplified architecture and centered graph compositions, and fallback/reduced-motion receives still artwork plus the complete HTML portfolio.
- The current working-tree rebuild is the baseline and must not be reverted.

## Open Questions
- None. The plan defaults above are sufficient for implementation.
