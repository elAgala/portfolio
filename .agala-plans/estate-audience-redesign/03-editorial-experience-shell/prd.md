# Editorial Experience Shell PRD

## Problem
The current HTML shell is readable but still feels layered over the scene: oversized framed project zones, duplicated visual treatments, tall mobile scroll distances, and a profile/contact composition that does not fully participate in the narrative.

## Users
- Time-constrained recruiter: needs identity, role, selected work, résumé, and contact with minimal friction.
- Hiring manager: needs a coherent story and direct evidence links.
- Keyboard, reduced-motion, low-power, or no-WebGL visitor: needs an equally complete portfolio.

## Goals
- Integrate editorial content with the estate’s camera framing without reducing legibility.
- Make résumé and case-study access obvious throughout the spectacle.
- Turn profile, principles, and contact into the Archive and Decision acts.
- Deliver equivalent information and brand quality in static fallback mode.

## Non-Goals
- Redesigning `/resume`, changing résumé content, or changing case-study route bodies.
- Hiding important content in canvas hover states, modal panels, or sound cues.

## User Stories
- As a recruiter, I want to reach the résumé from the first viewport and fixed navigation.
- As a visitor, I want chapter copy to appear where the scene leaves visual space, not cover the focal object.
- As a reduced-motion user, I want an intentional editorial site rather than a broken version of the 3D experience.

## Functional Requirements
1. Replace current generic project frames with compact evidence cards synchronized to scene safe zones.
2. Keep header, work anchors, résumé, contact, skip, and sound controls keyboard accessible.
3. Recompose Profile as the Archive with portrait, capabilities, principles, and an explicit résumé action.
4. Recompose Contact as the Decision with email, social links, and a single dominant CTA.
5. Supply chapter-specific static art and normal-flow layout for reduced motion/WebGL failure.
6. Preserve SEO metadata, structured data, prerendered text, and all existing routes.

## Acceptance Criteria
- Given any homepage viewport, then project title/copy meets WCAG AA contrast and never overlaps its focal graph.
- Given the first viewport, then “Open résumé” is visible without opening the menu on desktop and reachable within the mobile menu.
- Given keyboard-only navigation, then focus order follows the document and never enters the decorative canvas.
- Given fallback mode, then every project, profile capability, principle, link, and CTA remains visible in normal document flow.
- Given mobile, then no chapter exceeds 120svh solely to accommodate animation and no fixed control obscures body copy.

## Metrics
- A recruiter can reach any case study, résumé, or email action within two interactions.
- Zero horizontal overflow at 320, 390, 768, 1024, and 1440px widths.
- Accessibility score at least 95 and no serious axe findings.

## Dependencies
- Final camera safe zones and chapter state from the first two slices.
