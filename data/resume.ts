import type { Resume } from '~/types/portfolio'
import { careerEntries } from './career'

export const resume = {
  summary: 'Software engineer and technical lead building dependable product interfaces, backend services, and delivery systems. Combines hands-on engineering with architecture, mentoring, frontend standards, interviewing, and Linux infrastructure automation.',
  experience: careerEntries,
  education: [
    { dates: '2022–Present', degree: 'B.S. Computer Engineering', institution: 'UADE, Universidad Argentina de la Empresa' },
    { dates: '2019–2021', degree: 'B.S. Computer Engineering', institution: 'UBA, Universidad de Buenos Aires', detail: 'Five semesters completed' },
    { dates: 'Dec 2018', degree: 'First Certificate in English (B2)', institution: 'Cambridge Assessment English' },
  ],
  skillGroups: [
    { label: 'Frontend', skills: ['TypeScript', 'React', 'Next.js', 'Vue', 'Nuxt', 'Flutter'] },
    { label: 'Backend & data', skills: ['Go', 'C#', 'Node.js', 'NestJS', 'SQL Server', 'PostgreSQL', 'MongoDB'] },
    { label: 'Platform', skills: ['Linux', 'Azure', 'AWS', 'Docker', 'Ansible', 'OpenTofu', 'CI/CD'] },
  ],
  languages: [
    { language: 'Spanish', level: 'Native' },
    { language: 'English', level: 'Professional proficiency' },
  ],
} satisfies Resume
