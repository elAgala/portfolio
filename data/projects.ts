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
    repository: 'https://github.com/agala-labs/ui',
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
    slug: 'agala-setup',
    title: 'Agala Setup',
    description: 'Bash scripts that install my Fedora workstation: shell, editor, language runtimes and container tooling from one repository.',
    order: 2,
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
