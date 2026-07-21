# CLAUDE.md

Guidance for working in this repo (Julián Benitez / Agala's personal portfolio, Nuxt).

## Current design

Single-page editorial portfolio plus the frozen `/resume`. The homepage starts
with one restrained terminal interaction, then leaves the terminal metaphor
behind. Agala Labs is the flagship chapter, with product screenshots, a real
architecture breakdown, agentic engineering work, public repositories, and
experience. There are no `/work/[slug]` routes.

- Components: `SiteHeader`, `HeroTerminal`, `AgalaLabsSection`, `WorkSection`,
  `CareerSection`, `ContactSection`, and `SiteFooter`.
- Motion: the hero types the real `whoami` command once. Product screenshots
  have a small hover scale. Reduced-motion visitors receive the content
  immediately.
- Brand semantics: “Agala” is Julián's nickname and personal mark. “Agala Labs”
  is his software factory and links to `https://agala.com.ar`.
- Content order: identity → Agala Labs → public work → experience → contact.
- No status theater: never show availability with dots, pulses, badges, or words
  like ONLINE/OPERATIONAL/READY. Plain sentences only — enforced by
  `tests/content.spec.ts` and the `design-with-intent` skill.
- No interface theater: do not add fake IDs, terminal window chrome, code-like
  section names, fake file names, or decorative build metadata.
- Copy voice: direct and evidence-led. Resume-facing fields in `data/career.ts`
  (`summary`, `bullets`) stay formal — the frozen resume consumes them via
  `data/resume.ts`.

## Personal-Iconography Doctrine

Any visual element, metaphor, or interactive centerpiece on the portfolio homepage
must trace to one of:

1. A real row in `data/profile.ts`, `data/lab.ts`, `data/projects.ts`, or `data/career.ts`.
2. A real image asset already committed under `public/images/`.
3. A real external URL (a GitHub repo under github.com/elAgala, or a live product
   under *.agala.com.ar).

If a proposed visual cannot be traced to one of the above, it does not ship,
no matter how polished or "engineer-coded" it looks. This rule exists because four
prior hero centerpieces (operator desk, puzzle box, oscilloscope, pocket watch) were
each internally consistent, accessible, and lint/typecheck/test-clean, and were still
rejected as generic — because each was an invented analogy ("engineers value X, so:
object that represents X") rather than something literally true about the site owner.

When in doubt: prefer showing a real screenshot, a real repo, or the real avatar over
inventing a new object.

## Frozen surfaces

- `pages/resume.vue`, `scripts/generate-resume.mjs`, and all `.resume-*` / `@layer print`
  CSS rules are frozen — plain black-and-white, ATS-scanner-friendly, matching the
  project's first iteration. Do not restyle without an explicit request.
