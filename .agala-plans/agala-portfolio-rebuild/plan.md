# Agala Portfolio Rebuild Plan

## Outcome

Rebuild `julian-benitez-portfolio` so that every visual and interactive choice traces to a verifiable fact about Julián Benitez / Agala — his real shipped products (Smaltt, Kervo), his real open-source repos (Agala UI, Agala AI, Agala Setup), his real career record, and his own illustrated avatar — instead of an invented metaphor. The intended outcome is a portfolio a technical hiring manager remembers and trusts on first visit: fast, honest, distinctive, and unmistakably *his*, not "a portfolio template with his name on it."

This plan exists because four prior redesign passes in this repo (color-only reskin, structural CSS pass, and three different hero centerpieces — operator desk → puzzle box → oscilloscope → pocket watch) each passed every automated check available (ESLint, `nuxt typecheck`, Vitest, the custom accessibility/interaction audit, route isolation, static generation) and were still rejected by the owner as "trash" / "AI slop" / "has nothing to do with me." That pattern is itself the finding this plan has to fix — see **Root-Cause Finding** below — not a reason to attempt a fifth guess of the same shape.

## Root-Cause Finding: why four rounds failed despite passing every check

1. **Automated checks can't catch "generic."** Lint/typecheck/tests/a11y audits verify the code works and is accessible. None of them can tell you the hero object is a plausible AI-generated metaphor rather than something true about the person. All four passes were engineering-correct and design-arbitrary.
2. **Every hero centerpiece so far was an invented symbol, not a fact.** Operator desk, puzzle box, oscilloscope, and pocket watch are all *reasoned analogies* ("engineers are precise, so: a watch"). None of them are literally, checkably true about Julián. That is exactly what makes a portfolio read as templated — the object could belong to any developer.
3. **The one asset in this repo that is unarguably, specifically his** is `public/images/julian-portrait.webp` (his own commissioned illustrated avatar) and the real project/company graph (AlixPartners → Agala Labs → Smaltt/Kervo/Agala UI/Agala AI/Agala Setup). Both were already in the repo and under-used: the avatar was shrunk and desaturated to a corner byline; the project graph was never visualized at all — instead each new hero reached for an unrelated invented object.
4. **Fix going forward:** every future centerpiece/visual decision must trace to a row in `data/*.ts`, a real image asset, or a real external URL. If a decision can't be traced to one of those, it doesn't ship. This is captured as a standing rule in Shared Decisions and enforced per-sub-feature below.

## Repo Findings

- `pages/index.vue` (106 lines): homepage composition — hero, Products, Systems, Open work, Experience, Profile, Contact sections in that order. Imports `data/career.ts`, `data/lab.ts`, `data/profile.ts`, `data/projects.ts`.
- `components/workbench/WorkbenchHero.vue` (29 lines): hero shell; currently renders a small circular avatar byline + `AgalaChronometer` 3D object in the right column. This is the fourth centerpiece attempt and is being replaced (see sub-feature 01).
- `components/chronometer/AgalaChronometer.client.vue` + `components/chronometer/runtime/agala-chronometer.ts`: current (rejected) pocket-watch centerpiece. To be deleted in sub-feature 01, same way `components/puzzle/*` and `components/signal/*` were deleted in earlier passes this session.
- `components/workbench/ProjectRelease.vue`, `WorkbenchExperience.vue`, `WorkbenchProfile.vue`, `WorkbenchContact.vue`: remaining section components. `WorkbenchExperience` and the Systems decision list in `pages/index.vue` currently share a near-identical "eyebrow + heading + numbered row list" skeleton, which is the second flagged defect ("same shit, another color") — needs deliberate visual differentiation, not just new copy.
- `assets/css/main.css` (454 lines, single file, `@layer reset/base/components/responsive/print`): all site styling lives here. Contains the current warm ink/paper/wine/brass token set (`--navy`, `--cobalt`, `--paper`, `--muted`, etc. — names are legacy from the blue-palette era and now hold warm values, which is confusing for future maintenance) and the `.section-intro` header pattern that had a real grid-auto-placement bug (fixed this session, but worth re-auditing under the new plan for consistency).
- `data/profile.ts`: `profile.avatar = '/images/julian-portrait.webp'`, capabilities, principles. `data/lab.ts`: `productProofs` (Smaltt, Kervo, each now with a real `image` screenshot path) and `engineeringDecisions` (title + narrative + tools, already de-templated this session). `data/career.ts`: three real career entries with parseable `dates` strings. `data/projects.ts`: three real public repos (Agala UI, Agala AI, Agala Setup) with `repository` GitHub URLs.
- `types/portfolio.ts`, `types/workbench.ts`, `utils/workbench.ts`: shared types and the `chooseHeroSceneQuality()` adaptive-tier helper (`high`/`balanced`/`fallback` based on reduced-motion, WebGL availability, viewport, DPR, CPU cores) — this helper is centerpiece-agnostic and should be reused by whatever replaces the chronometer.
- `scripts/verify-workbench.mjs`, `scripts/validate-route-isolation.mjs`, `tests/content.spec.ts`: all three encode the *current* centerpiece's class names/selectors (`.chronometer-*`, `AgalaChronometer`) and must be updated in lockstep with any rename, or CI-equivalent checks silently stop testing the real component.
- **Dead code found, not previously flagged:** `components/RevealOnScroll.client.vue` and `components/SectionHeading.vue` exist but are not imported anywhere in the current template tree (`grep` across `.vue`/`.ts` found zero usages outside their own files). Likely leftover from the very first commit (`0f61105`). Remove during sub-feature 00 cleanup.
- **Stale prior plan found:** `.agala-plans/estate-audience-redesign/` documents an earlier, since-abandoned "cinematic Godfather estate" direction (`PortfolioExperience.client.vue`, `utils/experience.ts`, GSAP) that no longer exists in the repo. Do not resume it; it predates the current warm/editorial identity and the Agala brand framing entirely. Left in place for history, not referenced further by this plan.
- No `@el-agala/ui` / `@agala-labs/ui` dependency in `package.json` — see Agala UI Audit below.

## Sub-Features

| Order | Sub-feature | Boundary | Why independent | Depends on |
| --- | --- | --- | --- | --- |
| 0 | Visual System Foundation | Design tokens, type scale, the `.section-intro` header pattern, motion/interaction principles, the Personal-Iconography Doctrine (see Shared Decisions) | Every other slice consumes these tokens/patterns; must be settled and lint-clean before section work starts | None |
| 1 | Hero & Identity Centerpiece | `WorkbenchHero.vue`, hero copy, avatar treatment, the interactive 3D/graph centerpiece and its runtime | Fully replaces `components/chronometer/*`; reviewable in isolation against the hero viewport alone | 0 |
| 2 | Product & Open-Work Evidence | Products section (Smaltt/Kervo screenshots) + Open Work section (`ProjectRelease.vue`, case study cards) | Both are "real evidence" sections with a similar screenshot/proof pattern; already mostly correct from this session's earlier passes, this slice audits and polishes rather than rebuilds | 0 |
| 3 | Engineering Narrative & Experience | Systems (`engineeringDecisions`) + Experience (`WorkbenchExperience.vue`) | These two currently share a skeleton and are the flagged "same shit" sections; needs a joint pass so they read as deliberately different, not accidentally identical | 0 |
| 4 | About & Contact Closing | `WorkbenchProfile.vue`, `WorkbenchContact.vue`, `SiteFooter.vue` | Smallest, most stable surface; last because it depends on the tone set by 1–3 | 0, 1 |

Résumé (`pages/resume.vue`, `scripts/generate-resume.mjs`) is explicitly **out of scope** per owner instruction ("Resume is ok for now, we'll polish text after").

## Implementation Sequence

1. **Sub-feature 0** first and alone: lock the token names, the section-header pattern, and write down the Personal-Iconography Doctrine as an enforceable checklist. Nothing in 1–4 should start until this is approved, because it is what stops sub-feature 1 from becoming a fifth invented metaphor.
2. **Sub-feature 1** next, in isolation: this is the highest-risk, most-iterated surface. Build it, screenshot it at rest and mid-interaction, and get explicit sign-off before touching anything else — do not bundle it with other section changes the way earlier passes did, since that made it hard to isolate what specifically was being rejected.
3. **Sub-features 2 and 3** can proceed in parallel once 0 is done (both only depend on the foundation, not on 1) — 2 is largely an audit/polish pass, 3 is a real visual-differentiation pass.
4. **Sub-feature 4** last, once the hero's tone (1) and the evidence sections' density (2, 3) are final, so the closing section can deliberately contrast with what came before instead of guessing at it.

## Shared Decisions

- **Personal-Iconography Doctrine (binding on every sub-feature):** a visual element is only allowed if it traces to one of: (a) a real row in `data/profile.ts`, `data/lab.ts`, `data/projects.ts`, `data/career.ts`; (b) a real image asset already in `public/images/`; (c) a real external URL (GitHub repo, live product). No new invented objects, metaphors, or "engineer culture" props (no more watches, oscilloscopes, puzzle boxes, desks) unless the owner explicitly asks for a specific one by name.
- **Avatar policy:** `julian-portrait.webp` is full color everywhere (no `grayscale()` filter, this session already removed the two instances that had it) and is a primary hero element, not a small corner byline.
- **Token rename:** `--navy`/`--navy-deep`/`--navy-raised`/`--cobalt`/`--cobalt-light`/`--bone` currently hold warm ink/wine/brass values — names are a holdover from the blue-palette era. Sub-feature 0 renames them to `--ink`/`--ink-deep`/`--ink-raised`/`--wine`/`--brass`/`--paper-bright` (or equivalent) so the CSS is legible to whoever edits it next, human or agent.
- **Component naming discipline:** whatever replaces the chronometer must not itself become stale-named after the next iteration — name the component/runtime/CSS classes after what it *is* (e.g. if sub-feature 1 lands on "real project graph," name it `AgalaEstate`/`AgalaGraph`-equivalent, not a leftover instrument name), and update `tests/content.spec.ts`, `scripts/verify-workbench.mjs`, `scripts/validate-route-isolation.mjs` in the same commit.
- **One centerpiece decision, reviewed before building everything around it.** Sub-feature 1's `design.md` commits to one specific, doctrine-compliant concept (see that folder) rather than presenting another multiple-choice menu — the owner has already been asked to choose between invented options three times this session; this plan owes a decision, not another survey.
- Keep `utils/workbench.ts` (`chooseHeroSceneQuality`) as the shared adaptive-quality contract for any WebGL work; keep the existing reduced-motion/no-WebGL fallback-poster pattern (static image + real DOM controls) used by every centerpiece so far, since it is sound and was never part of what got rejected.

## Agala UI Audit

| Need | Existing Agala UI component | Usage decision |
| --- | --- | --- |
| N/A — this repo has no `@el-agala/ui`/`@agala-labs/ui` dependency (checked `package.json`) | — | This is Julián's standalone public portfolio, not an internal Agala Labs product app; it intentionally does not consume the internal design system. Continue with this repo's own local `assets/css/main.css` token/class conventions, renamed per Shared Decisions above. Do not introduce a dependency on the internal UI package here. |

## Risks

- **Re-litigating taste in code review instead of in the plan.** Mitigation: sub-feature 1's `design.md` is written to be concrete enough (exact geometry/behavior in words) that "does this match the plan" is a yes/no question against the doctrine, not a fresh aesthetic judgment call.
- **Doctrine becomes a straitjacket that produces something boring.** Mitigation: the doctrine constrains *subject matter* (must be real), not *treatment* (still fully permitted to be stylized, animated, interactive, dramatic) — see sub-feature 1 design direction.
- **Renaming CSS tokens touches every section.** Mitigation: sub-feature 0's tasks do the rename as a mechanical find/replace with a full rebuild+screenshot pass before any content changes land on top of it, so token renames and content changes aren't tangled in the same diff.
- **Fifth rejection risk.** Mitigation: sub-feature 1 requires an explicit screenshot-backed check-in after the first build, before starting sub-features 2–4, specifically so a bad call is caught in one isolated slice instead of discovered after a full-site pass again.

## Assumptions

- The owner's "best portfolio of all time" bar means: fast, accessible, honest (real evidence over decoration), and visually distinctive *because* it's specifically about Julián — not maximal visual complexity. This plan optimizes for that reading.
- Keeping the existing warm ink/paper/wine/brass palette (already approved this session) rather than re-opening color as a question.
- Keeping the existing IA/section order (Hero → Products → Systems → Open work → Experience → Profile → Contact) — the complaints so far have been about execution (layout bugs, invented objects, templated copy, desaturated avatar), not about information architecture.
- Résumé route/PDF/print styling is frozen for this plan per explicit instruction.

## Open Questions

- Sub-feature 1 commits to a specific centerpiece concept (a real project/company relationship graph centered on the avatar — see that folder's `design.md`) rather than re-asking. If this still doesn't land with the owner, the next step should be a direct question ("what object or detail do *you* associate with your own work") rather than another agent-generated option set — three rounds of agent-generated options have already been rejected.
- Whether Julián wants the avatar illustration used elsewhere on the site beyond hero + About (e.g., as a favicon/OG-image element) is left open; not required for this plan to proceed.
