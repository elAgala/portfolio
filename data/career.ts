import type { CareerEntry, ExperienceSignal } from '~/types/portfolio'

export const experienceSignals = [
  {
    title: 'Lead multidisciplinary teams',
    detail: 'At AlixPartners, I lead the technical direction of multidisciplinary product teams spanning Argentina and Europe while staying hands-on in architecture and delivery.',
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
    role: 'Technical Lead / Software Engineer',
    company: 'AlixPartners',
    location: 'Buenos Aires, Argentina',
    summary: 'Technical leadership and hands-on delivery across multidisciplinary product teams in Argentina and Europe.',
    bullets: [
      'Lead technical direction for multidisciplinary product teams across Argentina and Europe, turning product requirements into architecture and delivery plans while remaining hands-on in implementation and code review.',
      'Architect and build product systems from scratch across frontend applications, backend services, data, and Azure infrastructure.',
      'Co-lead the Frontend Guild and develop a shared design-system library, standardizing interface patterns and engineering practices across applications.',
      'Improve delivery and support workflows through automation and repeatable processes; mentor engineers and conduct structured technical interviews.',
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
      'Build and operate Smaltt and Kervo, production applications for dental-practice management and retail operations.',
      'Architect their shared Nuxt, Go, and PostgreSQL foundation and integrations for payments, billing, messaging, object storage, and AI features.',
      'Own production infrastructure end to end, including Hetzner and Linux provisioning, OpenTofu, Ansible, Docker delivery, Woodpecker CI, observability, and secrets management.',
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
    bullets: [
      'Delivered web and mobile products from requirements through launch and support using Vue, Flutter, Node.js, C#, MongoDB, and PostgreSQL.',
      'Deployed and supported production workloads across AWS and Linux infrastructure.',
    ],
    stack: ['Node.js', 'C#', 'Vue', 'Flutter', 'MongoDB', 'PostgreSQL', 'AWS', 'Linux'],
  },
] satisfies CareerEntry[]
