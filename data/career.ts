import type { CareerEntry } from '~/types/portfolio'

export const careerEntries = [
  {
    dates: '2021–Present',
    role: 'Software Engineer / Tech Lead',
    company: 'AlixPartners',
    location: 'Global / Buenos Aires',
    summary: 'Technical leadership and hands-on delivery across globally distributed product teams.',
    bullets: [
      'Holds Tech Lead responsibilities across globally distributed teams, guiding technical direction, architecture decisions, delivery coordination, and mentoring.',
      'Co-leads the Frontend Guild, aligning engineering practices across Next.js, React, and Vue applications.',
      'Conducts technical interviews and contributes to structured candidate assessment.',
      'Builds internal and client-facing products with Next.js, React, Vue, C#, NestJS, SQL Server, and Azure.',
    ],
    stack: ['Next.js', 'React', 'Vue', 'C#', 'NestJS', 'SQL Server', 'Azure'],
  },
  {
    dates: '2026–Present',
    role: 'Creator / Software Engineer',
    company: 'Agala Labs',
    location: 'Independent engineering',
    summary: 'A private product engineering lab spanning reusable interfaces, services, and automated Linux infrastructure.',
    bullets: [
      'Builds a reusable private product platform across Nuxt and Vue applications with shared frontend infrastructure.',
      'Engineers Go service gateways and PostgreSQL-backed integrations with clear operational boundaries.',
      'Automates Linux infrastructure and delivery with OpenTofu, Ansible, Docker, secrets tooling, and CI/CD.',
    ],
    stack: ['Nuxt', 'Vue', 'TypeScript', 'Go', 'PostgreSQL', 'Linux', 'OpenTofu', 'Ansible', 'Docker'],
    layers: [
      { label: 'Product surfaces', detail: 'Reusable application shells and shared frontend infrastructure.', tools: ['Nuxt', 'Vue', 'TypeScript'] },
      { label: 'Services', detail: 'Typed gateways and durable data integrations.', tools: ['Go', 'PostgreSQL'] },
      { label: 'Platform', detail: 'Repeatable Linux environments and delivery automation.', tools: ['OpenTofu', 'Ansible', 'Docker', 'CI/CD'] },
    ],
  },
  {
    dates: '2018–2021',
    role: 'Freelance Software Engineer',
    company: 'Self-employed',
    location: 'Buenos Aires',
    summary: 'End-to-end delivery of web and mobile products, from interface through deployment.',
    bullets: [
      'Delivered medium-scale web and mobile products across Node.js, C#, Vue, and Flutter.',
      'Designed MongoDB and PostgreSQL data layers and operated custom Linux infrastructure on AWS.',
    ],
    stack: ['Node.js', 'C#', 'Vue', 'Flutter', 'MongoDB', 'PostgreSQL', 'AWS', 'Linux'],
  },
] satisfies CareerEntry[]
