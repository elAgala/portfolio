# Julián Benitez — Portfolio

A cinematic software-engineering portfolio and a deliberately formal, ATS-safe résumé. Built with Nuxt 4, Vue 3, TypeScript, Three.js, GSAP, and static generation.

The homepage is a progressively enhanced 3D executive study. Its models, materials, particles, lighting, and optional soundscape are generated locally in code; semantic HTML remains available when WebGL or motion is disabled.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run generate
npm run scene:validate
npm run route:validate
```

The estate runtime is split under `components/experience/runtime/` into renderer,
camera, staged loader, world, audio, and disposal modules. Authored GLBs are
reproducibly generated with `npm run scene:build`; the validation scripts enforce
node names, geometry budgets, and résumé-route isolation.

Project evidence is defined once in `data/experience-graphs.ts`. Those definitions
drive the instanced Three.js blueprint, deployment topology, and orchestration
council as well as the semantic phase annotations shown in the page.

The recruiter-facing shell is split into typed chapter components under
`components/chapters/` and styled in `assets/css/portfolio.css`. The same semantic
content drives cinematic and static modes; reduced-motion and WebGL fallback use
optimized estate frames from `public/stills/` instead of hiding any evidence.

With the development server running, the estate authoring and QA utilities can
regenerate those frames and verify the responsive shell:

```bash
npm run scene:stills -- http://127.0.0.1:43177 43178
npm run visual:regression
npm run accessibility:audit
```

The two port arguments are the local Nuxt and temporary Chrome debugging ports;
neither is used by the production application.

Static output is written to `.output/public` and deployed to the existing VPS through Woodpecker and Ansible.

## Content

Edit the typed sources in `data/`:

- `profile.ts` — identity, positioning, links, capabilities, principles
- `resume.ts` — experience, education, skills, languages
- `projects.ts` — featured project evidence and case-study narrative

The content reflects the local résumé source and public repositories available at implementation time. Keep claims measurable and attributable when updating it.

## Résumé PDF

After `npm run generate`, create the downloadable PDF with:

```bash
npm run resume:pdf
```

The script uses an installed Chrome/Chromium executable, prints the `/resume` route, and places the final PDF in both `public/` and `.output/public/`.

Set `NUXT_PUBLIC_SITE_URL` when the canonical production URL differs from `https://julian.benitez.ar`.
