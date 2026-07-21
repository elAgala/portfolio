# Portfolio Redesign — Design Directions

> **Prototypes**: `.designs/portfolio-redesign/`
> **Target**: `pages/index.vue` + new section components (single long page, `/work/*` removed)
> **Audience**: engineering peers. Goal: impress with craft and depth. Résumé handles hiring.

## Locked decisions (from intake)

| Decision | Value |
|---|---|
| Structure | Single long page + frozen `/resume` |
| Theme | Dark |
| Hero | Name + role, pure type (no invented objects — CLAUDE.md doctrine) |
| Sections | Hero+manifesto → Featured work → Products → Engineering decisions → Career → Principles & contact |
| Copy | Terse, declarative (rewritten in `data/*.ts`) |
| Motion | Expressive |
| Doctrine | All imagery traces to `data/*` or `public/images/*` (avatar, Smaltt, Kervo) |

## The three directions

### A — Minimal Typographic (`direction-a-minimal.html`)
Neutral near-black (`#0a0a0a`), ivory, zero accent color. Signature: numbered section
index with hairline rule draw-in (`01 / Featured work`), enormous negative letter-spacing
name, meta row of mono links. Motion: slow rises + line draws, `cubic-bezier(.19,1,.22,1)`.
Mood: Swiss restraint. Safest, most timeless. Lets content density do the work.

### B — Dark Technical (`direction-b-technical.html`)
Existing warm palette (ink `#0b0908`, paper `#eee4d5`, brass `#ad8a54`, ok-green).
Signature: terminal window hero (`$ whoami --verbose`) with blinking cursor, log-line
section headers (`[01] featured_work — 3 repos, public`), spec panels with corner ticks,
diff-style problem/result lines (`− problem:` / `+ result:`), career as log table.
Mood: engineer-coded, literal. Strongest peer-signaling, highest gimmick risk.

### C — Kinetic Editorial (`direction-c-kinetic.html`)
Warm black (`#0c0b09`), ivory, electric volt accent (`#d8f34f`), Georgia italic
accents against grotesk uppercase. Signature: type IS the layout — viewport-wide
uppercase headlines, italic serif interjections, marquee divider, giant ghost numerals,
product names overlapping screenshots. Motion: slide-in line reveals, marquee, hover
color swaps. Mood: distinctive, confident, magazine-like. Most memorable, most opinionated.

## Motion notes (all directions)

- Reveal: translateY 1.6–3rem + fade, 900–1100ms, ease-out-expo; stagger 80–160ms per sibling.
- Headline line-reveals via `overflow: hidden` row wrappers (C) — port to Vue with a
  `useReveal` composable + IntersectionObserver.
- `prefers-reduced-motion`: disable marquee, cursor blink, transforms; keep opacity only.
- Marquee (C): duplicate track, 28s linear infinite, pause on hover.

## Component tree (winner → implementation)

```
pages/index.vue
├── SiteHeader (redesigned per direction)
├── HeroSection          — name, role, manifesto, links, status
├── WorkSection          — 3 × ProjectCard (repo link, meta, problem/result)
├── ProductsSection      — 2 × ProductCard (screenshot, category, url)
├── DecisionsSection     — 3 × DecisionCard
├── CareerSection        — 3 × CareerRow (portfolioBullets)
├── PrinciplesSection    — 3 × PrincipleCard
├── ContactSection       — email CTA + footer row
└── SiteFooter (merged into ContactSection or kept)
```

## States

Static content — no loading/error states. Empty: N/A (data is build-time constant).
Images: `loading="lazy"`, explicit alt, graceful layout if asset missing.

## Accessibility notes

- One `h1` (hero name); section `h2`s visually styled as labels in B/C — keep real heading order.
- Marquee and ghost numerals: `aria-hidden="true"`.
- Cursor blink in B: decorative, `aria-hidden`.
- Focus: visible outline in accent color; links ≥ .72rem mono are fine at 44px touch via padding.
- Contrast: muted text passes AA on all three palettes at body sizes.

## Design → Code alignment

| Design element | In current code? | Action |
|---|---|---|
| Single-page sections | Partially (workbench components) | Rebuild all section components |
| `/work/[slug]` depth | Exists | Delete route; fold problem/result depth into project cards |
| three.js constellation | Exists | Remove dep + components |
| Warm ink palette | Exists (tokens in `main.css`) | Keep for B; replace for A/C |
| Fonts (Inter Tight, JetBrains Mono) | Installed via fontsource | Keep; add Georgia stack for C |
| Resume route/styles | Frozen | Zero changes |

## Open UX questions

1. ~~Which direction~~ → **B (Dark Technical) won.** Implemented in Nuxt.
2. ~~Avatar placement~~ → Unused for now; hero is pure terminal type.
3. ~~Sticky header~~ → Sticky mono bar (B), backdrop blur.

## De-slop changes applied during implementation

Per `design-with-intent` skill (`anti-slop-patterns.md`):

- **Removed** pulsing green status dot + "status: open to..." row. Availability is
  now a plain sentence in `.hero-meta` (no dot, no pulse, no badge).
- **Removed** "● live" dots on product tags; tag shows category only. The live
  URL link carries the proof.
- **Removed** "uptime: 8+ yrs" pseudo-metric; replaced with plain
  `timezone: utc-3` / `shipping since 2018` facts.
- Kept terminal cursor blink — authentic to the chosen motif; disabled under
  `prefers-reduced-motion`.
- Contrast: all informational small text uses `--muted` (#a89a8a, AA on dark);
  `--faint` reserved for decorative, aria-hidden elements only.
- `tests/content.spec.ts` enforces the ban: fails on ONLINE/OPERATIONAL/READY
  vocabulary, status-dot patterns, and pulse keyframes.
