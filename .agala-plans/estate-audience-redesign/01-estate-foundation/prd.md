# Estate Foundation PRD

## Problem
The current experience demonstrates WebGL but reads as a sequence of primitive objects arranged along one desk. It lacks the spatial progression, sculptural detail, lighting contrast, and camera staging needed to feel like a world-class cinematic portfolio.

## Users
- Technical recruiter: needs to identify role, work, résumé, and contact without learning a 3D interface.
- Engineering leader: wants evidence of systems thinking and craft, not decorative animation alone.
- Peer engineer/designer: wants a memorable demonstration of frontend, rendering, performance, and interaction judgment.

## Goals
- Create a coherent original estate with five visually distinct zones connected by one camera journey.
- Make the first 10 seconds immediately communicate identity, atmosphere, and software-engineering purpose.
- Establish reusable scene, asset, camera, lighting, and quality-tier architecture for all later graphs.
- Preserve SSR content, native scrolling, graceful failure, and the separate lightweight résumé route.

## Non-Goals
- Free-roaming first-person controls, physics gameplay, character models, or cinematic cutscenes that remove user control.
- Photorealism at the expense of loading time or legibility.
- Recreating any specific film set or using recognizable copyrighted assets.

## User Stories
- As a recruiter, I want the page to be readable before 3D finishes loading, so that the spectacle never blocks evaluation.
- As a visitor, I want scrolling to move naturally through a coherent place, so that animation feels purposeful.
- As a mobile visitor, I want the same narrative in a lighter composition, so that the experience remains impressive without overheating my device.
- As a reduced-motion user, I want a complete static portfolio with equivalent information.

## Functional Requirements
1. Render one persistent canvas behind semantic homepage content and dispose it fully on route change.
2. Load a Threshold/Study core first, then load Council Table and Archive assets without blocking HTML.
3. Drive camera position, target, roll, and FOV from typed chapter keyframes and native scroll progress.
4. Support high, balanced, and fallback tiers with separate model assets and renderer settings.
5. Provide deterministic cold-open, replay, skip, direct-anchor, context-loss, tab-hidden, and loading-timeout behavior.
6. Expose load progress and active chapter to the editorial shell without making the canvas interactive or focusable.

## Acceptance Criteria
- Given a capable desktop, when the visitor scrolls from hero to contact, then the camera visibly traverses all five zones without cuts, clipping, or one-frame jumps.
- Given a mobile viewport, when each chapter is centered, then its focal object remains fully visible and text does not overlap the HUD.
- Given slow asset loading, when 1.5 seconds elapse, then the HTML portfolio is fully revealed while the scene continues loading behind it.
- Given reduced motion or failed WebGL initialization, when the homepage opens, then no camera animation runs and the complete portfolio remains usable.
- Given navigation to `/resume`, then the estate bundle and GLB assets are not loaded.

## Metrics
- High tier: median 55–60 FPS, fewer than 120 draw calls, fewer than 250k visible triangles.
- Balanced tier: at least 30 FPS, fewer than 65 draw calls, fewer than 80k visible triangles.
- Deferred 3D transfer: no more than 2.2 MB for high core assets and no more than 900 KB for balanced assets.
- Lighthouse accessibility at least 95; no serious axe violations.

## Dependencies
- Existing Three.js/GSAP client stack.
- Original estate GLB assets and compressed textures.
- Project graph anchor positions defined by the next sub-feature.
