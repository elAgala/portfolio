# Editorial Experience Shell Design

## UX Intent
The shell should behave like a restrained title sequence and archival publication: dramatic typography, minimal chrome, excellent scanning, and no competition with the 3D focal object.

## Layout
- Desktop: twelve-column page grid over the canvas. Each chapter declares `left`, `right`, or `center` copy alignment from its camera safe zone; copy width stays between 32–44rem.
- Mobile: normal vertical flow with a dedicated graph/art window followed by copy. Header remains compact; sound lives below the header and progress moves to the edge rather than over text.

## Visual Hierarchy
1. Headline/project name and one outcome sentence.
2. Evidence phase or capability details.
3. Metadata, stack, chapter index, and secondary links.

## Component Plan
| Area | Component | Details |
| --- | --- | --- |
| Header | `SiteHeader.vue` | Keep mark, Work, Profile, Résumé, Contact; use a darker translucent state after Threshold. |
| Hero | `HeroChapter.vue` | Preserve headline; add compact availability and visible work/résumé actions. |
| Projects | `ProjectEvidenceCard.vue` | Compact borderless evidence layout with phase annotation and “Examine the case.” |
| Archive | `ProfileArchive.vue` | Portrait dossier, capability index, principles tabs, résumé action. |
| Decision | `ContactDecision.vue` | One dominant email action, secondary external links, final seal state. |
| Static mode | `StaticPortfolio.vue` | Uses the same semantic content with chapter poster art and no fixed camera choreography. |

## Interaction Details
- Header anchors scroll natively and set the correct camera chapter; direct hash entry never runs the cold open.
- Project evidence phase annotations crossfade only after the next phase is established; no character-by-character text animation.
- Archive capability rows are always visible HTML; hover may highlight the related dossier tab but never reveals hidden essential copy.
- Contact CTA receives the strongest focus/hover treatment: brass rule advances, seal subtly rotates, and email remains selectable.
- Footer replay restarts only the Threshold reveal, not the full page position.

## States
- Loading: semantic shell is visible with static Threshold artwork.
- Error: static edition uses intentional chapter posters and removes sound/replay controls.
- Reduced motion: no sticky scene choreography; subtle opacity transitions only when allowed.
- Menu open: opaque near-black panel, trapped only by normal navigation semantics, escape closes, route change closes.
- Sound disabled: label “Sound off”; enabled: “Sound on”; state persists for the session only.

## Copy
- Intro: “An audience with the work.”
- Work prologue: “Three systems. Presented as evidence.”
- Project action: “Examine the case.”
- Archive résumé action: “Review the formal record.”
- Contact prelude: “Every consequential system starts with a conversation.”
- Contact headline: “Let’s make something that lasts.”

## Styling Notes
- Keep Bodoni Moda for display and Manrope for information; reduce competing giant numerals and use consistent editorial type steps.
- Replace glass-card styling with near-opaque ink panels, brass rules, and purposeful whitespace; blur should not be required for contrast.
- Use one border language, one metadata style, and one CTA treatment across all chapters.
- Static posters should be original renders from the same estate scene, not unrelated generated artwork.
