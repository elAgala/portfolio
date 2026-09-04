import type { CareerEntry, ExperienceSignal } from '~/types/portfolio'

export const experienceSignals = [
  {
    title: 'Lead multidisciplinary teams',
    detail: 'At AlixPartners, I lead the technical direction of multidisciplinary product teams spanning Argentina, the US, and Europe while staying hands-on in architecture and delivery.',
  },
  {
    title: 'Build the foundations',
    detail: 'I’ve designed product systems from scratch and built a design-system library that turns repeated interface decisions into reusable components and standards.',
  },
  {
    title: 'Improve the delivery loop',
    detail: 'I automate recurring work, improve delivery and support processes, and mentor engineers through technical decisions and day-to-day implementation.',
  },
] satisfies ExperienceSignal[]

export const careerEntries = [
  {
    dates: '2021–Present',
    company: 'AlixPartners',
    location: 'Buenos Aires, Argentina',
    summary: 'Architecture and hands-on delivery of client-facing and internal tools, with engineering standards and cross-team integrations across the organization.',
    positions: [
      {
        role: 'Technical Lead / Software Engineer',
        dates: '2024–Present',
        bullets: [
          'Design and build client-facing and internal tools from the ground up, owning technical architecture while staying hands-on in implementation and code review.',
          'Co-lead the Frontend Guild and develop a shared design-system library, defining reusable interface patterns and engineering standards across the organization.',
          'Coordinate integrations between systems owned by different teams, aligning architecture and implementation so the applications work together.',
          'Automate delivery and support workflows, mentor engineers through implementation and design decisions, and conduct technical interviews.',
        ],
      },
      {
        role: 'Software Engineer',
        dates: '2021–2024',
        bullets: [
          'Built product systems from the ground up across frontend applications, backend services, databases, and Azure infrastructure.',
        ],
      },
    ],
    stack: ['Next.js', 'React', 'Vue', 'C#', 'NestJS', 'SQL Server', 'Kafka', 'Redis', 'Azure'],
  },
  {
    dates: '2026–Present',
    company: 'Agala Labs',
    location: 'Independent product engineering',
    summary: 'A private product engineering lab spanning reusable interfaces, services, and automated Linux infrastructure.',
    positions: [{
      role: 'Creator / Software Engineer',
      dates: '2026–Present',
      bullets: [
        'Build and operate Smaltt and Kervo: production software for dental-practice management and retail operations.',
        'Design Nuxt applications and Go services with PostgreSQL, integrating payments, billing, messaging, and AI capabilities.',
        'Own the path from implementation to production: Linux infrastructure, automated provisioning and deployment, observability, and secrets management.',
      ],
    }],
    stack: ['Nuxt', 'Vue', 'TypeScript', 'Go', 'PostgreSQL', 'Linux', 'OpenTofu', 'Ansible', 'Docker'],
    layers: [
      { label: 'Interfaces', detail: 'The shared pieces I use to start and shape Nuxt applications.', tools: ['Nuxt', 'Vue', 'TypeScript'] },
      { label: 'Go services', detail: 'Small gateways and PostgreSQL integrations with clear jobs.', tools: ['Go', 'PostgreSQL'] },
      { label: 'Linux platform', detail: 'Servers and deployments I can rebuild instead of remember.', tools: ['OpenTofu', 'Ansible', 'Docker', 'CI/CD'] },
    ],
  },
] satisfies CareerEntry[]
