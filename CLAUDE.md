# CLAUDE.md

Guidance for working in this repo (Julián Benitez / Agala's personal portfolio, Nuxt).

## Current design

Single-page editorial portfolio imported from the user-approved OpenDesign
Portfolio project, plus the frozen `/resume`. Preserve the original composition,
copy, Archivo typography, portrait and responsive rules. There are no
`/work/[slug]` routes.

- Homepage: `PortfolioDesign.vue`, `assets/css/portfolio.css`, and
  `utils/portfolio.ts`. Original assets live in `public/portfolio/`. Existing
  standalone section components are not used by this homepage.
- Motion: the hero intentionally types `whoaim`, then corrects it to `whoami` once. Keep this joke. Reduced-motion visitors
  receive the content immediately.
- Audio: SoundCloud playlist with offsets 3:02, 2:55, 3:28, 1:59, 1:27, and
  3:27. Apply offsets
  when playback is requested, never on initial widget readiness. Pause/resume
  retains position. The Breezy S artist upload has broken streams, so use the
  verified BELTERS 4U premiere of the same recording.
- Keep one SoundCloud widget. `utils/soundcloud-player.ts` publishes typed
  state and actions to `FloatingMusicPlayer` and `SoundCloudBackdrop`. The
  ambient waveform uses real track samples and stays hidden while paused,
  muted or unavailable. Keep maintained source in TypeScript.
- Brand semantics: “Agala” is Julián's nickname and personal mark. “Agala Labs”
  is his software factory and links to `https://agala.com.ar`.
- Content order: identity → working approach → AI workflow → everyday tools → Agala Labs → contact.
- No status theater: never show availability with dots, pulses, badges, or words
  like ONLINE/OPERATIONAL/READY. Plain sentences only — enforced by
  `tests/content.spec.ts` and the `design-with-intent` skill.
- No interface theater: do not add fake IDs, terminal window chrome, code-like
  section names, fake file names, or decorative build metadata.
- Copy voice: direct and evidence-led. Resume-facing fields in `data/career.ts`
  (`summary`, `positions[].bullets`) stay formal — the resume consumes them via
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

- `pages/resume.vue`, `scripts/generate-resume.ts`, and all `.resume-*` / `@layer print`
  CSS rules are frozen — plain black-and-white, ATS-scanner-friendly, matching the
  approved formal design. The user-approved revision groups positions under
  each company (AlixPartners: Technical Lead / Software Engineer 2024–Present,
  Software Engineer 2021–2024), with technical skills before education. Do not restyle without an
  explicit request.
