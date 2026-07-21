# About & Contact Closing Technical Spec

## Scope

Audit-and-confirm pass over `components/workbench/WorkbenchProfile.vue`, `components/workbench/WorkbenchContact.vue`, and their CSS in `assets/css/main.css` (`.agala-profile*`, `.capability-list*`, `.principle-list*`, `.agala-contact*`). Changes only if the audit finds a real inconsistency.

## Files And Modules

| Path | Change |
| --- | --- |
| `components/workbench/WorkbenchProfile.vue` | Confirm only, unless avatar-framing consistency check (see `design.md`) recommends a small border/frame adjustment to match sub-feature 01's hero avatar treatment |
| `components/workbench/WorkbenchContact.vue` | Confirm only |
| `assets/css/main.css` — `.agala-profile*`, `.capability-list*`, `.principle-list*`, `.agala-contact*` | Confirm renamed tokens (sub-feature 00) resolve correctly; no structural rule changes expected |

## Data Model

No changes — reuses `profile.capabilities`, `profile.principles`, `profile.manifesto`, `profile.links` unchanged.

## API Contract

Not applicable.

## Frontend State

Not applicable.

## Backend Flow

Not applicable.

## Permissions And Validation

Not applicable.

## Observability

Not applicable.

## Tests

- Unit/content: `npm run test` — no data changes expected, existing assertions unaffected.
- Visual: screenshot `#profile` and `#contact` at all five breakpoints after sub-features 00–03 land; confirm token consistency and compare avatar treatment against the hero from sub-feature 01.
- Manual: click the `mailto:` link and GitHub link to confirm they still resolve; click "Résumé" link to confirm it still routes to `/resume` (frozen, unaffected by this plan).

## Rollout Notes

- Last slice in the sequence — depends on sub-features 00 and 01 being visually final so the consistency comparison is meaningful.
- Expected outcome, like sub-feature 02, is likely "confirmed fine" — treat any actual diff as evidence-driven, not manufactured.
