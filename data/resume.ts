import type { Resume } from '~/types/portfolio'
import { careerEntries } from './career'

export const resume = {
  summary: 'Hands-on software engineer and technical lead spanning product interfaces, backend services, and production infrastructure. Leads multidisciplinary teams across Argentina and Europe and improves engineering quality through architecture, shared standards, automation, and mentoring.',
  experience: careerEntries,
  education: [
    { dates: '2022–Present', degree: 'B.S. Computer Engineering', institution: 'UADE, Universidad Argentina de la Empresa' },
    { dates: '2019–2021', degree: 'B.S. Computer Engineering', institution: 'UBA, Universidad de Buenos Aires', detail: 'Five semesters completed' },
  ],
  skillGroups: [
    { label: 'Frontend', skills: ['TypeScript', 'React', 'Next.js', 'Vue', 'Nuxt', 'Flutter'] },
    { label: 'Backend & Data', skills: ['Go', 'C#', 'Node.js', 'NestJS', 'SQL Server', 'PostgreSQL', 'MongoDB'] },
    { label: 'Platform & Delivery', skills: ['Linux', 'Azure', 'AWS', 'Docker', 'Ansible', 'OpenTofu', 'CI/CD'] },
  ],
  languages: [
    { language: 'Spanish', level: 'Native' },
    { language: 'English', level: 'Professional proficiency (Cambridge English B2, 2018)' },
  ],
} satisfies Resume
