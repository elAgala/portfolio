import type { Project } from '~/types/portfolio'

export const projects = [
  {
    slug: 'agala-ui',
    path: '/work/agala-ui',
    title: 'Agala UI',
    description: 'A zero-dependency Vue 3 component library with typed APIs, atomic design tokens, theming, and accessibility at its foundation.',
    order: 1,
    featured: true,
    year: '2026',
    role: 'Creator & maintainer',
    eyebrow: 'Design systems',
    repository: 'https://github.com/elAgala/agala-ui',
    stack: ['Vue 3', 'TypeScript', 'Vite', 'CSS tokens', 'npm workspaces'],
    outcome: 'A reusable product language spanning more than forty component families, calendar views, shared interaction composables, and a companion chart package.',
    challenge: 'Product teams lose time and consistency when every interface rebuilds the same controls, keyboard behavior, and responsive decisions from scratch.',
    approach: [
      'Established atomic CSS tokens and theme boundaries before styling individual components.',
      'Designed typed Vue APIs for common controls, navigation, overlays, data display, forms, and scheduling workflows.',
      'Extracted repeated accessibility behavior into focused composables for keyboard navigation, popovers, media queries, and selection.',
      'Kept the core library deliberately light while separating charting into an independent workspace package.',
    ],
    narrative: [
      {
        title: 'A system, not a component shelf',
        paragraphs: [
          'Agala UI treats visual consistency and behavioral consistency as the same engineering problem. Buttons and inputs matter, but so do focus movement, overlay positioning, empty states, selection models, and the way a theme crosses package boundaries.',
          'The library is organized around small typed contracts and composable behavior. That creates a stable foundation for product work without forcing every interface into one rigid visual expression.',
        ],
      },
      {
        title: 'The hard part',
        paragraphs: ['Scheduling pushed the system beyond isolated controls. Calendar month, week, day, and list views had to share date logic while supporting slot selection and different information densities. The result became a test of the entire design system: tokens, layout, state, keyboard behavior, and API shape working together.'],
      },
      {
        title: 'What it demonstrates',
        points: ['Product-minded API design for frontend infrastructure', 'Accessible interaction patterns rather than visual-only components', 'Package architecture with a zero-dependency core', 'Long-term thinking about theme contracts and evolution'],
      },
    ],
  },
  {
    slug: 'agala-deploy',
    path: '/work/agala-deploy',
    title: 'Agala Deploy',
    description: 'A containerized deployment entry point that combines Ansible, encrypted secrets, Git-backed inventories, and CI automation.',
    order: 2,
    featured: true,
    year: '2025–2026',
    role: 'Creator & maintainer',
    eyebrow: 'Platform engineering',
    repository: 'https://github.com/elAgala/agala-deploy',
    stack: ['Go', 'Ansible', 'Docker', 'SOPS', 'age', 'Woodpecker CI'],
    outcome: 'Deployment knowledge became a versioned, portable tool with explicit configuration, secret handling, validation, and predictable execution across environments.',
    challenge: 'VPS deployments often depend on local credentials, undocumented inventory paths, and CI-specific shell glue that becomes fragile as environments multiply.',
    approach: [
      'Packaged the deployment runtime into a container instead of relying on each CI runner’s local toolchain.',
      'Used SOPS and age for encrypted configuration while passing secrets only through explicit runtime boundaries.',
      'Pulled environment inventory from a separate Git repository to keep application code and operational configuration independently governed.',
      'Implemented the entry point in Go with fail-fast validation for credentials, playbooks, inventories, registry settings, and SSH material.',
    ],
    narrative: [
      {
        title: 'Make the safe path the repeatable path',
        paragraphs: [
          'Agala Deploy turns a chain of sensitive deployment steps into one explicit contract. The container receives credentials and target configuration, prepares a constrained execution environment, resolves the inventory, and hands control to Ansible.',
          'This is intentionally not a general deployment platform. It solves a concrete operating model well: static or containerized applications delivered through CI to managed VPS infrastructure.',
        ],
      },
      {
        title: 'Security as structure',
        paragraphs: ['The project keeps encrypted secrets outside application repositories, validates partial registry configuration, writes SSH material with restricted permissions, and avoids persisting the working environment after the container exits.'],
      },
      {
        title: 'What it demonstrates',
        points: ['Go used as a compact systems-integration language', 'CI/CD design around explicit inputs and failure modes', 'Practical secrets management with SOPS and age', 'Operational tooling built for repeatability rather than spectacle'],
      },
    ],
  },
  {
    slug: 'agala-ai',
    path: '/work/agala-ai',
    title: 'Agala AI',
    description: 'A portable operating system for AI-assisted product delivery, expressed as agents, focused skills, and stack-specific engineering contracts.',
    order: 3,
    featured: true,
    year: '2026',
    role: 'Designer & author',
    eyebrow: 'Developer experience',
    repository: 'https://github.com/elAgala/agala-ai',
    stack: ['Agent workflows', 'Markdown contracts', 'Nuxt', 'Go', 'Vue'],
    outcome: 'Product planning, design, implementation, review, and QA became reusable workflows with explicit responsibilities and stack-aware guidance.',
    challenge: 'General-purpose coding agents can produce fast output while missing the local standards, role boundaries, and verification habits that make work dependable.',
    approach: [
      'Split broad delivery work into product, architecture, frontend, backend, QA, review, and repair responsibilities.',
      'Encoded repeatable tasks as focused skills for Nuxt, Vue repositories, Go endpoints, design prototypes, review, and Git workflow.',
      'Added stack contracts for Nuxt and Go-plus-Vue applications so agents start from a shared technical baseline.',
      'Kept the system readable and portable as plain files rather than binding it to one proprietary runtime.',
    ],
    narrative: [
      {
        title: 'Better context beats louder prompting',
        paragraphs: [
          'Agala AI is an experiment in turning engineering judgment into reusable operating context. Instead of asking one agent to improvise every role, it gives planning, design, implementation, and verification their own boundaries.',
          'The repository is intentionally plain. Agents and skills are reviewable text; stack definitions make architectural expectations visible; narrowly-scoped recipes make recurring implementation work consistent.',
        ],
      },
      {
        title: 'A practical orchestration model',
        paragraphs: ['The system covers the full delivery loop without pretending every task needs a large process. Small skills handle concrete work. Specialist agents own broader review or implementation responsibility. Global rules keep security and code quality expectations constant across both.'],
      },
      {
        title: 'What it demonstrates',
        points: ['Product thinking applied to developer tooling', 'Agent orchestration through explicit responsibility boundaries', 'Reusable technical standards for Nuxt, Vue, and Go', 'A bias toward inspectable, vendor-light workflows'],
      },
    ],
  },
] satisfies Project[]

export function getProject(slug: string) {
  return projects.find(project => project.slug === slug)
}
