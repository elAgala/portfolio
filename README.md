# Julián Benitez — Operator Workbench

A distinctive software-engineering portfolio and a formal, exportable résumé. The homepage combines a warm editorial GUI, Linux/OSS details, a procedural Three.js system model, and a functional terminal drawer without compromising the recruiter-facing content.

## Experience

- **GUI-first portfolio:** selected work, architecture diagrams, verified project links, capability record, and direct contact paths.
- **Kernel stack machine:** a small procedural Three.js model representing interface, services, and platform layers. It supports pointer orbit, an inspect/assemble state, adaptive rendering, and an image fallback for reduced motion or unavailable WebGL.
- **Portfolio TTY:** open it with the fixed launcher or `Ctrl + backtick`. Supported commands are `help`, `whoami`, `projects`, `open`, `source`, `resume`, `contact`, `clear`, and `exit`. It uses an explicit parser; arbitrary code is never evaluated.
- **Formal résumé:** `/resume` is intentionally restrained, photo-free, print-safe, and available as a generated PDF.

The visual language borrows restraint, ceremony, oxblood, brass, and typography from *The Godfather* rather than reproducing film imagery or turning the page into a theme park.

## Development

```bash
npm install
npm run dev
```

The development server uses `http://127.0.0.1:43177` by default—never port 3000. The temporary headless-browser debugging port used by QA is `43178`.

## Content

Typed content lives in `data/`:

- `profile.ts` — identity, contact, positioning, capabilities, and principles
- `projects.ts` — featured open-source projects and case-study narratives
- `experience-graphs.ts` — semantic nodes and edges used by the GUI architecture diagrams
- `resume.ts` — experience, education, skills, and languages

The formal résumé and project case-study routes remain regular semantic pages; the Three.js runtime is homepage-only.

## Verification

With the development server running:

```bash
npm run lint
npm run typecheck
npm run test
npm run visual:regression
npm run accessibility:audit
```

The browser checks cover 320, 390, 768, 1024, and 1440 pixel viewports, horizontal overflow, named controls, required landmarks, terminal focus/command behavior, reduced-motion fallback, and the résumé route.

For the production output:

```bash
npm run generate
npm run route:validate
npm run resume:pdf
```

`resume:pdf` prints the generated `/resume` route and writes `public/julian-benitez-resume.pdf` as well as the matching file in `.output/public`.

Set `NUXT_PUBLIC_SITE_URL` when the production canonical URL differs from `https://julian.benitez.ar`.
