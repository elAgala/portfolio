# Agala / Julián Benitez — Portfolio

A Nuxt portfolio for Julián “Agala” Benitez. The homepage reproduces the Portfolio project in OpenDesign: identity, working approach, AI workflow, Agala Labs architecture, and contact.

## Experience

- **Original design:** Archivo and JetBrains Mono, the original portrait, responsive composition, and the typing/correction introduction.
- **Agala Labs:** the original architecture chapter covering applications, shared services, data, infrastructure, and delivery.
- **SoundCloud:** Audio Junkies — “Aspects Of Rhythm” (3:02), Sako Isoyan — “Wow” (2:55), and Breezy S — “UFO On A Limousine” (3:28). Playback begins on interaction; switching tracks reapplies the selected offset, while pause/resume retains the current position.
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

The imported homepage lives in `components/PortfolioDesign.vue`, with its original styles in `assets/css/portfolio.css`, local assets in `public/portfolio/`, and lifecycle-managed interactions in `utils/portfolio.js`. Homepage and résumé styles are loaded separately to preserve the formal résumé layout. SoundCloud requires network access; errors expose the original track link as a fallback.

The Breezy S track uses the BELTERS 4U release premiere on SoundCloud. During verification, the artist upload returned HTTP 404 from both stream endpoints; the premiere played the same 6:32 recording from 3:28.

- `profile.ts` — identity, contact information, and positioning
- `lab.ts` — Agala Labs products, architecture, tooling, and agentic work
- `projects.ts` — public open-source projects and supporting narratives
- `career.ts` — the career record used by the resume
- `resume.ts` — experience, education, skills, and languages

The formal resume is the only secondary route.

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
push to `master` validates it, publishes the exact 40-character commit SHA, and
deploys that image to `https://julian.benitez.ar/` through the shared
`platform-iac` static-site role.

Required Woodpecker repository secrets:

- `gh_username`
- `gh_token`
- `ssh_deploy_key`

Build and verify the image locally:

```bash
docker build --build-arg VCS_REF=local -t portfolio:local .
docker run --rm -p 8080:8080 portfolio:local
curl --fail http://127.0.0.1:8080/healthz
```

Every push to `master` publishes and deploys its commit SHA automatically. To
roll back, revert the unwanted change on `master`; the revert commit is built
and deployed through the same pipeline while DNS and edge routes remain
unchanged.
