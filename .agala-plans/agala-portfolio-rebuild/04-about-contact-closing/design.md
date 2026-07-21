# About & Contact Closing Design

## UX Intent

A confident close: confirm identity once more (real photo, real principles), then one clear action (contact). Should feel like a natural conclusion to a page that already proved everything else with real evidence — not a second "let me introduce myself" moment competing with the hero.

## Layout

Unchanged from current implementation:
- `#profile`: two-column grid, portrait left (`.agala-profile__portrait`, 4:5 aspect), copy right (manifesto, capability `dl`, principle list spanning full width below).
- `#contact`: three-column grid on wine background, CTA heading + email link center, nav links (GitHub, Résumé) right.

No structural layout change planned — this is an audit/consistency slice per `prd.md`.

## Visual Hierarchy

Unchanged:
1. Portrait (About) — full color, grayscale filter already removed this session.
2. Manifesto paragraph.
3. Capabilities `dl` (4 items: Technical leadership, Product engineering, Backend & data, Platform engineering).
4. Principle list (3 numbered items).
5. Contact CTA heading + email (largest text on wine background) + nav links.

## Component Plan

| Area | Component | Details |
| --- | --- | --- |
| About | `components/workbench/WorkbenchProfile.vue` | No structural changes expected; verify token consistency after rename |
| Contact | `components/workbench/WorkbenchContact.vue` | No structural changes expected; verify token consistency after rename |

## Interaction Details

Unchanged — real `mailto:` link, real GitHub link, real `/resume` route link.

## States

Not applicable — static content.

## Copy

No changes planned. If the audit finds the About manifesto or principles read as generic filler now that the rest of the page is more concretely evidence-driven, flag for a light copy pass — but do not preemptively rewrite working copy.

## Styling Notes

- Confirm `.agala-profile__portrait img` (4:5 aspect, `object-fit: cover`, full color) uses a border/frame treatment that feels related to whatever frame language sub-feature 01 lands on for the hero avatar (e.g. if the hero avatar gets a brass ring border, consider whether the About portrait should echo that language subtly, or whether intentional contrast — hero close-up vs. About formal portrait — is the better read). Decide during implementation by comparing both live, not in the abstract.
- No new tokens or classes expected.
