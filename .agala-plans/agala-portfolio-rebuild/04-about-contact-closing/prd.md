# About & Contact Closing PRD

## Problem

`WorkbenchProfile.vue` (About) and `WorkbenchContact.vue` (Contact) are the closing sections and were not specifically criticized this session — the Profile section's avatar was fixed (grayscale removed) as part of the earlier avatar fix, and the wine-background Contact CTA was already reviewed favorably. This slice exists to (a) confirm both still work correctly after sub-features 00–03 land, and (b) make sure the closing tone deliberately follows from whatever the hero (01) and evidence sections (02, 03) establish, rather than being generic filler at the bottom of the page.

## Users

- **Technical visitors who scrolled the whole page:** by this point they've seen the real hero centerpiece, real product proof, and the differentiated Systems/Experience sections. About/Contact should land as a confident close, not trail off.

## Goals

- Confirm the avatar in `WorkbenchProfile.vue` (`.agala-profile__portrait`) is full color, correctly sized, and consistent in treatment with the hero avatar from sub-feature 01 (same person, should feel like the same visual system, not two unrelated photo treatments).
- Confirm the Principles list (`person.principles`, numbered 01–03) is not made redundant by sub-feature 03's Systems de-numbering — since Systems will no longer be numbered after 03, Principles becomes the only numbered list left on the page, which is fine (no duplication) but should be a deliberate confirmation, not an oversight.
- Confirm Contact's wine-background CTA still reads correctly against the final renamed tokens from sub-feature 00.

## Non-Goals

- Not redesigning the Profile/Contact layout — audit and confirm, change only what's found broken or inconsistent.
- Not adding new capabilities/principles content.

## User Stories

- As a visitor reaching the end of the page, I want the closing sections to feel consistent with the confident, real-evidence tone set earlier, so the page doesn't fizzle out into generic "about me" filler.
- As Julián, I want my About-section photo and hero photo to look like part of the same deliberate system, not two different fixes applied at different times.

## Functional Requirements

1. Re-render `#profile` and `#contact` after sub-features 00–03 land; confirm colors/spacing correctly reflect renamed tokens.
2. Compare the About-section avatar treatment (`.agala-profile__portrait img`, 4:5 aspect, full color, grayscale filter already removed this session) against the hero's avatar/centerpiece treatment from sub-feature 01 for visual consistency (same avatar asset, compatible framing/border language).
3. Confirm the Principles numbered list reads correctly as the page's one remaining numbered list (no visual collision with Systems' new card grid or Experience's new rail).

## Acceptance Criteria

- Given sub-features 00–03 are complete, when `#profile` and `#contact` render, then all colors resolve to renamed tokens with no regressions.
- Given the hero (01) and About avatar are compared side by side, then both read as the same deliberate photo treatment (full color, consistent border/frame language), not visually unrelated.
- Given Systems (03) is now unnumbered and Principles (04) is still numbered, when a visitor scans the full page, then the one remaining numbered list does not read as accidentally repeating a pattern removed elsewhere — confirm this qualitatively, adjust Principles' treatment only if it does read that way in practice.

## Metrics

- Qualitative: closing sections feel consistent with the rest of the rebuilt page, confirmed by full-page screenshot review.

## Dependencies

- Sub-features 00 and 01 should land first (needs final tokens and the final hero avatar treatment to compare against).
