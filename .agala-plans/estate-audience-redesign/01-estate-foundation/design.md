# Estate Foundation Design

## UX Intent
The visitor should feel received into a private, consequential space—not dropped into a tech demo. Movement is composed like a slow dolly shot, but the visitor always controls progress through native scrolling.

## Layout
- Desktop: full-viewport fixed canvas; HTML occupies deliberate left/right safe zones defined per chapter. The camera travels through connected architecture rather than laterally past isolated props.
- Mobile: centered focal objects, wider camera FOV, no lateral parallax, reduced room depth, and 105–120svh chapters rather than the current 145–190svh spans.

## Spatial Sequence
1. **Threshold:** near-black carved double doors, a slim line of warm light, marble floor monogram, and suspended dust. The three-second cold open opens one door and reveals the study.
2. **Study:** walnut desk, banker lamp, Venetian-blind shadows, cream dossier, rotary telephone silhouette, leather chair edge, and the JB seal. No human figure or copied film composition.
3. **Council Table:** a long polished table beneath a single overhead pool of light. Three evidence mechanisms occupy stable stations and activate as the camera arcs around the table.
4. **Archive:** floor-to-ceiling file drawers, brass label holders, portrait dossier, and principle cards. A drawer opens as the profile arrives.
5. **Decision Doorway:** an envelope and wax seal on a narrow console; beyond it, an abstract Buenos Aires dawn glow. The contact CTA remains HTML in the foreground.

## Visual Hierarchy
1. Current chapter focal object and primary headline.
2. Project outcome or personal positioning.
3. Chapter index, metadata, sound, and progress.

## Component Plan
| Area | Component | Details |
| --- | --- | --- |
| Persistent canvas | `EstateExperience.client.vue` | Orchestrates renderer, loader, camera, quality, lifecycle, and chapter state only. |
| World | `EstateWorld.ts` | Owns room groups, activation ranges, lights, materials, and model binding. |
| Camera | `CinematicCameraRig.ts` | Evaluates position/target/FOV keyframes and damped pointer influence. |
| Loading | `ExperienceLoader.vue` | Non-blocking thin progress line; becomes “Static edition” only on failure. |
| HUD | `ExperienceHud.vue` | Chapter label, progress, and sound; keyboard accessible and mobile-safe. |

## Interaction Details
- Scroll remains native; no snapping or scroll-jacking.
- Pointer motion produces at most 0.2–0.35 world-unit camera drift on high tier and is disabled on touch/balanced.
- The cold open lasts 2.8–3.2 seconds, appears only once per session, remains skippable, and never runs on anchor entry or reduced motion.
- Camera transitions use deliberate ease-in/ease-out zones; architectural occluders mask room transitions naturally.
- Sound remains off initially. Enabling it adds room tone, door/lamp details, paper movement, and restrained mechanical pulses—never recognizable film music.

## States
- Loading: static Threshold artwork and semantic hero appear immediately; a 1px brass line indicates scene progress without percentage copy.
- Empty: not applicable; all portfolio content is local and typed.
- Error: swap the canvas for chapter-specific still artwork and label the HUD “Static edition”; do not show a technical error message.
- Reduced motion: render a static Study frame and normal editorial sections with no fixed-canvas progress choreography.
- Success: blend the loaded scene beneath existing HTML without layout shift.

## Copy
- Cold-open overline: “An audience with the work.”
- Hero headline: “Built with intent. Made to endure.”
- Loading fallback label: “Static edition.”
- Skip control: “Skip introduction.”

## Styling Notes
- Palette: near-black `#070504`, walnut `#2a1510`, oxblood `#651b21`, aged brass `#ad8750`, parchment `#e5d6be`, smoke `#8f867d`.
- Materials should be imperfect but restrained: subtle roughness variation, fingerprint-like gloss breakup, paper fibers, beveled brass, and marble veining.
- Light is the primary color system: warm practical light, cool dawn spill, narrow oxblood accents.
- Avoid excessive bloom, floating particles everywhere, glossy sci-fi surfaces, generic neon, lens flares, and blurred HTML.
