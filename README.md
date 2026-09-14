# Agala / Julián Benitez — Portfolio

A Nuxt portfolio for Julián “Agala” Benitez. The homepage reproduces the Portfolio project in OpenDesign: identity, working approach, AI workflow, Agala Labs architecture, and contact.

## Experience

- **Original design:** Archivo and JetBrains Mono, the original portrait, responsive composition, and the introduction intentionally typing `whoaim` before correcting it to `whoami`.
- **Agala Labs:** the original architecture chapter covering applications, shared services, data, infrastructure, and delivery.
- **SoundCloud:** Audio Junkies — “Aspects Of Rhythm” (3:02), Sako Isoyan — “Wow” (2:55), Breezy S — “UFO On A Limousine” (3:28), Alpyren — “Cold Case (ODTF002)” (1:59), Known Artist — “I Need (Rosa Red Remix)” (1:27), and Voodoos and Taboos — “Witch House [PHONICAM001]” (1:58). Playback begins on interaction; switching tracks reapplies the selected offset, while pause/resume retains the current position.
- **Accessible by default:** semantic sections, visible headings, keyboard navigation, responsive layouts, and reduced-motion handling.
- **Formal resume:** `/resume` is intentionally restrained, photo-free, print-safe, and available as a generated PDF.

The visual language uses ink, paper, brass, and wine with restrained editorial typography. A small terminal motif is confined to the hero. The rest of the page avoids fake IDs, shell chrome, code-like headings, decorative status indicators, invented metrics, and generic glass-and-glow effects.

## Development

```bash
npm install
npm run dev
```

The development server uses `http://127.0.0.1:43177` by default—never port 3000. The temporary headless-browser debugging port used by QA is `43178`.

## Content

Typed content lives in `data/`:

The imported homepage lives in `components/PortfolioDesign.vue`, with styles in `assets/css/portfolio.css` and local assets in `public/portfolio/`. Interactions are TypeScript: `utils/portfolio.ts` owns navigation, the introduction and clipboard; `utils/soundcloud-player.ts` owns the single SoundCloud widget and publishes typed state/actions to the floating player and waveform background. Homepage and résumé styles are loaded separately to preserve the formal résumé layout.

“Listen to some house music I like” becomes a compact floating invitation after the original player scrolls above the header. After interaction, it exposes shared playback controls without creating another iframe. Both players use play/pause, with no separate mute control. The real SoundCloud waveform appears only during confirmed playback. A softly smoothed 24-second window scrolls with the current audio position centered, without a visible cursor. Waveform data is loaded on demand, validated and cached in memory; failures leave audio untouched. Drawing stops in hidden tabs, and reduced-motion visitors get a static waveform. Keyboard focus is retained when scrolling back to the original player.

The app, maintenance scripts and ESLint configuration use TypeScript. The maintenance commands run with Node 22's native type stripping; generated JavaScript in Nuxt build output is not maintained source.

The Breezy S track uses the BELTERS 4U release premiere on SoundCloud. During verification, the artist upload returned HTTP 404 from both stream endpoints; the premiere played the same 6:32 recording from 3:28.

- `profile.ts` — identity, contact information, and positioning
- `lab.ts` — Agala Labs products, architecture, tooling, and agentic work
- `projects.ts` — public open-source projects and supporting narratives
- `career.ts` — the career record used by the resume
- `resume.ts` — experience, education, skills, and languages
- `social.ts` — shared social metadata and versioned preview image URL

The formal resume is the only secondary route.

The playlist also includes Demi Riquísimo & Hammer — “Lime House” (2:58), using the MINITEL upload on SoundCloud.

The music queue is shuffled once when the homepage player mounts, including the first track. Next, previous and automatic advance follow that order, wrapping after all seven tracks; pause/resume does not reshuffle. Each track keeps its configured starting offset.

The share preview uses the current portrait and brand assets. After editing `scripts/social-card.html`, run `npm run social:image` with Chrome installed (`CHROME_PATH` can override its location), then update the image version in `data/social.ts`. Commit the generated `public/og-image.png` before deployment. Existing messages may retain a cached preview until the sharing service fetches the metadata again.

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run generate
npm run route:validate
npm run resume:pdf
```

`resume:pdf` prints the generated `/resume` route and writes `public/julian-benitez-resume.pdf` as well as the matching file in `.output/public`. Homepage content tests also reject the faux-terminal and decorative-status patterns intentionally removed from the site.

Set `NUXT_PUBLIC_SITE_URL` when the production canonical URL differs from `https://julian.benitez.ar`.

## Deployment

The portfolio is published as an immutable static image at
`ghcr.io/elagala/portfolio:<commit-sha>`. Pull requests validate the site. A
push to `master` validates it and publishes the exact 40-character commit SHA.
Once the revision-bound Kubernetes release runner owned by `platform-iac` has
been published by digest, production deployment uses the separate
`.woodpecker/release.yml` workflow for a manually approved Woodpecker deployment
event targeting `portfolio_production`. Its pinned `crane` step runs
`deploy/resolve-release-image.sh`, resolves the exact commit tag to a digest,
verifies the OCI revision label and passes a one-line digest record to the
release runner. The digest is never entered as a free-form deployment parameter.
The reviewed resolver image is
`gcr.io/go-containerregistry/crane/debug@sha256:54b27703e6c602fbd6f95712910e9c8d45d4361a59274bde38aeec943734e424`
(crane v0.21.7); the final workflow must keep that immutable reference.

Required Woodpecker repository secrets:

- `gh_username`
- `gh_token`
- `platform_git_release_token` (release workflow only)

Build and verify the image locally:

```bash
docker build --build-arg VCS_REF=local -t portfolio:local .
docker run --rm -p 8080:8080 portfolio:local
curl --fail http://127.0.0.1:8080/healthz
```

Pushes never deploy automatically. The Kubernetes release remains disabled until
the cluster, release identity, application admission and manually approved
`portfolio_production` target are ready. Once enabled, Kubernetes restores the
previous workload manifest when a later rollout fails. Compose is not a
post-cutover fallback: the platform retirement playbook removes it after the
NodePort and public route both serve the accepted Kubernetes revision.
