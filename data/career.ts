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
      'Holds Tech Lead responsibilities across globally distributed teams, guiding technical direction, architecture decisions, delivery coordination, and mentoring.',
      'Co-leads the Frontend Guild, aligning engineering practices across Next.js, React, and Vue applications.',
      'Conducts technical interviews and contributes to structured candidate assessment.',
      'Builds internal and client-facing products with Next.js, React, Vue, C#, NestJS, SQL Server, and Azure.',
    ],
    portfolioBullets: [
      'Lead architecture and delivery for distributed product teams while continuing to write production code.',
      'Co-lead the Frontend Guild across React, Next.js and Vue teams.',
      'Run technical interviews and contribute to candidate assessment.',
      'Build Next.js and Vue interfaces, C# and NestJS services, and systems on SQL Server and Azure.',
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
      'Builds a reusable private product platform across Nuxt and Vue applications with shared frontend infrastructure.',
      'Engineers Go service gateways and PostgreSQL-backed integrations with clear operational boundaries.',
      'Automates Linux infrastructure and delivery with OpenTofu, Ansible, Docker, secrets tooling, and CI/CD.',
    ],
    portfolioBullets: [
      'Build Smaltt and Kervo on a shared Nuxt and Vue foundation.',
      'Write Go gateways and PostgreSQL integrations for payments, billing and messaging.',
      'Provision and operate the Linux delivery platform with OpenTofu, Ansible, Docker and Woodpecker CI.',
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
      'Delivered medium-scale web and mobile products across Node.js, C#, Vue, and Flutter.',
      'Designed MongoDB and PostgreSQL data layers and operated custom Linux infrastructure on AWS.',
    ],
    portfolioBullets: [
      'Delivered web and mobile products end to end in Node.js, C#, Vue, and Flutter.',
      'Owned data models, AWS servers, deployments and post-launch fixes.',
    ],
    stack: ['Node.js', 'C#', 'Vue', 'Flutter', 'MongoDB', 'PostgreSQL', 'AWS', 'Linux'],
  },
] satisfies CareerEntry[]
