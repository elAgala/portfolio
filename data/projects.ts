import type { Project } from '~/types/portfolio'

export const projects = [
  {
    slug: 'agala-ui',
    title: 'Agala UI',
    description: 'The Vue 3 component library used across Agala products. It covers controls, overlays, data display, forms, calendars and charts.',
    order: 1,
    featured: true,
    year: '2026',
    role: 'Creator & maintainer',
    eyebrow: 'Design systems',
    repository: 'https://github.com/elAgala/agala-ui',
    stack: ['Vue 3', 'TypeScript', 'Vite', 'CSS tokens', 'npm workspaces'],
    outcome: 'The core has 40+ typed component families and no runtime dependencies. Shared composables handle keyboard navigation, overlays, selection and responsive behavior.',
    challenge: 'Every new product rebuilt the same controls — slower and less coherent each time.',
    approach: [
      'Defined CSS tokens first, so components shared a language before they shared a look.',
      'Designed typed Vue APIs for controls, navigation, overlays, data display, forms, and scheduling.',
      'Pulled repeated accessibility work into composables: keyboard navigation, popovers, media queries, selection.',
      'Kept the core dependency-free and moved charting into its own workspace package.',
    ],
    narrative: [
      {
        title: 'Consistency is behavioral, not just visual',
        paragraphs: [
          'Buttons and inputs are the easy part. Focus movement, overlay positioning, empty states, and selection models decide whether a library actually feels coherent.',
          'The answer is small typed contracts and composable behavior — a dependable starting point that doesn’t force every product into the same look.',
        ],
      },
      {
        title: 'Scheduling forced the pieces to agree',
        paragraphs: ['Month, week, day, and list views share date logic at very different information densities. Getting that right meant tokens, layout, state, keyboard behavior, and API design all had to line up — that’s when the library became a system.'],
      },
      {
        title: 'What the work proves',
        points: ['Product-minded component APIs', 'Accessibility as part of the contract', 'A dependency-free core', 'Theme boundaries that evolve with their consumers'],
      },
    ],
  },
  {
    slug: 'agala-ai',
    title: 'Agala AI',
    description: 'A public repository of plain-text agents, skills and stack guides for coding assistants working in my projects.',
    order: 2,
    featured: true,
    year: '2026',
    role: 'Designer & author',
    eyebrow: 'Developer experience',
    repository: 'https://github.com/elAgala/agala-ai',
    stack: ['Agent workflows', 'Markdown contracts', 'Nuxt', 'Go', 'Vue'],
    outcome: 'It separates product planning, architecture, implementation, review and QA into inspectable workflows, each with its own context and checks.',
    challenge: 'A fast assistant that doesn’t know local conventions produces fast, wrong code.',
    approach: [
      'Split broad work into product, architecture, frontend, backend, QA, review, and repair roles — each with one job.',
      'Turned recurring tasks into focused skills for Nuxt, Vue, Go, design, review, and Git workflows.',
      'Wrote stack guides so an agent starts with the same technical expectations I do.',
      'Kept everything as plain readable files — no proprietary runtime required.',
    ],
    narrative: [
      {
        title: 'Context beats a louder prompt',
        paragraphs: [
          'Assistants don’t fail from lack of cleverness; they fail from missing context. Writing down how a project should be built — once, in files anyone can review — fixed more than any prompt tuning did.',
          'The result is boring in the right way: agents follow the same conventions a new hire would.',
        ],
      },
      {
        title: 'Enough process for the job',
        paragraphs: ['Not every task needs a chain of agents. Small skills handle concrete jobs; specialists only appear when the work actually earns them.'],
      },
      {
        title: 'What I am learning',
        points: ['Developer tools improve when treated like products', 'Clear responsibility matters for agents and teams', 'Standards are useful when they travel with the task', 'Inspectable workflows outlive clever black boxes'],
      },
    ],
  },
  {
    slug: 'agala-setup',
    title: 'Agala Setup',
    description: 'Bash scripts that install my Fedora workstation: shell, editor, language runtimes and container tooling from one repository.',
    order: 3,
    featured: true,
    year: '2025–2026',
    role: 'Creator & maintainer',
    eyebrow: 'Linux & developer experience',
    repository: 'https://github.com/elAgala/agala-setup',
    stack: ['Bash', 'Fedora', 'DNF', 'Zsh', 'Neovim', 'tmux', 'Docker'],
    outcome: 'Each toolchain has its own rerunnable script, so I can rebuild or change the workstation without relying on remembered setup steps.',
    challenge: 'Years of setup decisions lived only in my memory. Rebuilds were slow and impossible to audit.',
    approach: [
      'Split the setup into one script per toolchain — each readable, rerunnable, and replaceable.',
      'Established a small Fedora baseline before layering shell, terminal, editor, and runtimes.',
      'Automated Zsh, Neovim, Kitty, tmux, Node, .NET, Flutter, Docker, and the tools around them.',
      'Stayed close to native Fedora tooling, so the machine feels like Linux, not an opaque layer.',
    ],
    narrative: [
      {
        title: 'The workstation is infrastructure',
        paragraphs: [
          'The machine that builds the software is part of the delivery system. Its shell, editor, runtimes, and containers deserve the same repeatability as a production environment.',
          'Writing those choices down as executable Bash beat trusting memory.',
        ],
      },
      {
        title: 'Small scripts, visible choices',
        paragraphs: ['Each layer does one job. When something breaks, the failure says where and why. Swapping a tool means editing one script, not unpicking the whole machine.'],
      },
      {
        title: 'What the work proves',
        points: ['Linux as a deliberate engineering environment', 'Transparent native automation', 'Developer experience as a systems problem', 'Reproducibility from workstation to production'],
      },
    ],
  },
] satisfies Project[]
