import type { Resume } from '~/types/portfolio'
import { careerEntries } from './career'

export const resume = {
  headline: 'Technical Lead · Hands-on Software Engineer',
  summary: 'Hands-on technical lead working across frontend, backend, and production infrastructure. Turns product requirements into technical decisions, writes and reviews code, and guides distributed teams through implementation and delivery. Works with teams across Argentina, the US, and Europe.',
  experience: careerEntries,
  education: [
    { dates: '2022–Present', degree: 'Computer Engineering — in progress', institution: 'UADE' },
    { dates: '2019–2021', degree: 'Computer Engineering coursework', institution: 'Universidad de Buenos Aires', detail: 'Five semesters completed' },
  ],
  skillGroups: [
    { label: 'Frontend', skills: ['TypeScript', 'React / Next.js', 'Vue / Nuxt'] },
    { label: 'Backend & Data', skills: ['Go', 'C#', 'Node.js / NestJS', 'PostgreSQL', 'SQL Server', 'Kafka', 'Redis'] },
    { label: 'Platform & Delivery', skills: ['Azure', 'Linux', 'Docker', 'Ansible', 'OpenTofu', 'CI/CD'] },
    { label: 'Observability', skills: ['Prometheus', 'Grafana'] },
  ],
  languages: [
    { language: 'Spanish', level: 'Native' },
    { language: 'English', level: 'Professional working proficiency' },
  ],
} satisfies Resume
