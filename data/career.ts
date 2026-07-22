import type { CareerEntry } from '~/types/portfolio'

export const careerEntries = [
  {
    dates: '2021–Present',
    role: 'Software Engineer / Tech Lead',
    company: 'AlixPartners',
    location: 'Global / Buenos Aires',
    summary: 'Technical leadership and hands-on delivery across globally distributed product teams.',
    portfolioSummary: 'I lead distributed product teams without leaving the code.',
    bullets: [
      'Sets technical direction for globally distributed product teams while remaining hands-on in architecture, delivery, and code review.',
      'Co-leads the Frontend Guild, defining shared engineering practices across Next.js, React, and Vue applications.',
      'Mentors engineers and conducts technical interviews using structured candidate assessments.',
      'Ships internal and client-facing products across frontend applications, C# and NestJS services, SQL Server, and Azure.',
    ],
    portfolioBullets: [
      'Set technical direction for distributed teams, from architecture decisions through production delivery.',
      'Stay hands-on with Next.js and Vue interfaces and C# and NestJS services.',
      'Co-lead the Frontend Guild, mentor engineers and run technical interviews.',
      'Work across SQL Server and Azure in internal and client-facing systems.',
    ],
    stack: ['Next.js', 'React', 'Vue', 'C#', 'NestJS', 'SQL Server', 'Azure'],
  },
  {
    dates: '2026–Present',
    role: 'Creator / Software Engineer',
    company: 'Agala Labs',
    location: 'Independent engineering',
    summary: 'A private product engineering lab spanning reusable interfaces, services, and automated Linux infrastructure.',
    portfolioSummary: 'My own lab: recurring problems become products and tools.',
    bullets: [
      'Designs and operates Smaltt and Kervo, production applications for dental practice management and retail operations.',
      'Maintains their shared application foundation, PostgreSQL data layer, and integrations for payments, billing, messaging, object storage, and AI.',
      'Provisions Hetzner infrastructure and Linux servers with OpenTofu and Ansible, then deploys Docker services through Woodpecker CI.',
      'Runs observability, secrets management, and day-to-day production operations.',
    ],
    portfolioBullets: [
      'Design and operate Smaltt and Kervo, from product workflows and interfaces to production services.',
      'Maintain shared data and integration layers for payments, billing, messaging, object storage and AI features.',
      'Provision Hetzner and Linux infrastructure with OpenTofu and Ansible, then ship Docker services through Woodpecker CI.',
      'Run observability, secrets management and day-to-day operations.',
    ],
    stack: ['Nuxt', 'Vue', 'TypeScript', 'Go', 'PostgreSQL', 'Linux', 'OpenTofu', 'Ansible', 'Docker'],
    layers: [
      { label: 'Interfaces', detail: 'The shared pieces I use to start and shape Nuxt applications.', tools: ['Nuxt', 'Vue', 'TypeScript'] },
      { label: 'Go services', detail: 'Small gateways and PostgreSQL integrations with clear jobs.', tools: ['Go', 'PostgreSQL'] },
      { label: 'Linux platform', detail: 'Servers and deployments I can rebuild instead of remember.', tools: ['OpenTofu', 'Ansible', 'Docker', 'CI/CD'] },
    ],
  },
  {
    dates: '2018–2021',
    role: 'Freelance Software Engineer',
    company: 'Self-employed',
    location: 'Buenos Aires',
    summary: 'End-to-end delivery of web and mobile products, from interface through deployment.',
    portfolioSummary: 'Full ownership: rough idea to running system.',
    bullets: [
      'Took web and mobile projects from early requirements through launch and support.',
      'Built with Node.js, C#, Vue, and Flutter, backed by MongoDB and PostgreSQL.',
      'Operated AWS and Linux infrastructure for production workloads.',
    ],
    portfolioBullets: [
      'Took web and mobile projects from early requirements through launch and support.',
      'Built with Node.js, C#, Vue and Flutter, backed by MongoDB and PostgreSQL.',
      'Operated AWS and Linux infrastructure for production workloads.',
    ],
    stack: ['Node.js', 'C#', 'Vue', 'Flutter', 'MongoDB', 'PostgreSQL', 'AWS', 'Linux'],
  },
] satisfies CareerEntry[]
