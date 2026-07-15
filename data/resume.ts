import type { Resume } from '~/types/portfolio'

export const resume = {
  summary: 'Software engineer experienced in building maintainable web products, backend services, and deployment systems. Works across technical leadership, hands-on delivery, and mentoring, with a focus on turning complex requirements into dependable software.',
  experience: [
    {
      dates: '2021–Present',
      role: 'Software Engineer',
      company: 'AlixPartners',
      location: 'Global / Buenos Aires',
      bullets: [
        'Builds and maintains internal and client-facing tools in collaboration with globally distributed teams.',
        'Contributes as an engineer, technical leader, and mentor, including ownership of complex technical decisions.',
        'Works across Vue.js frontends, C# and NestJS services, SQL Server data, and Azure infrastructure.',
      ],
    },
    {
      dates: '2018–2021',
      role: 'Freelance Software Engineer',
      company: 'Self-employed',
      location: 'Buenos Aires',
      bullets: [
        'Delivered medium-scale web and mobile products across Node.js, C#, Vue.js, and Flutter.',
        'Designed data layers with MongoDB and PostgreSQL and operated custom Linux infrastructure on AWS.',
      ],
    },
  ],
  education: [
    { dates: '2022–Present', degree: 'B.S. Computer Engineering', institution: 'UADE — Universidad Argentina de la Empresa' },
    { dates: '2019–2021', degree: 'B.S. Computer Engineering', institution: 'UBA — Universidad de Buenos Aires', detail: 'Five semesters completed' },
    { dates: 'Dec 2018', degree: 'First Certificate in English — B2', institution: 'Cambridge Assessment English' },
  ],
  skillGroups: [
    { label: 'Core', skills: ['TypeScript', 'Node.js', 'C#', 'Vue.js', 'Flutter', 'SQL'] },
    { label: 'Working knowledge', skills: ['Go', 'React', 'Angular', 'Python', 'MongoDB', 'PostgreSQL'] },
    { label: 'Platform', skills: ['Azure', 'AWS', 'Docker', 'Ansible', 'Linux'] },
  ],
  languages: [
    { language: 'Spanish', level: 'Native' },
    { language: 'English', level: 'Professional proficiency' },
  ],
} satisfies Resume
