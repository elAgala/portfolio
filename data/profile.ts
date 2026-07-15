import type { Profile } from '~/types/portfolio'

export const profile = {
  name: 'Julián Benitez',
  initials: 'JB',
  title: 'Software Engineer / Tech Lead',
  location: 'Buenos Aires, Argentina',
  availability: 'Open to ambitious engineering work',
  email: 'julian@benitez.com.ar',
  website: 'julian.benitez.ar',
  summary: 'I lead and build maintainable software across product interfaces, backend systems, and the Linux infrastructure that carries them into production.',
  manifesto: 'The best systems feel inevitable. Clear boundaries. Useful abstractions. No ceremony without purpose. I lead close to the hard decisions, help teams sharpen their craft, and stay until the details hold.',
  avatar: '/images/julian-portrait.webp',
  links: [
    { label: 'GitHub', url: 'https://github.com/elAgala' },
    { label: 'Email', url: 'mailto:julian@benitez.com.ar' },
    { label: 'Résumé', url: '/resume' },
  ],
  capabilities: [
    {
      title: 'Technical leadership',
      description: 'Technical direction, mentoring, hiring, and shared frontend standards for distributed engineering teams.',
      tools: ['Tech Lead', 'Frontend Guild', 'Mentoring', 'Interviews'],
    },
    {
      title: 'Product engineering',
      description: 'Interfaces that make complicated work feel direct and remain maintainable after launch.',
      tools: ['TypeScript', 'React', 'Next.js', 'Vue', 'Nuxt', 'Flutter'],
    },
    {
      title: 'Backend & data',
      description: 'Practical services shaped around clear contracts, durable data, operational safety, and fast delivery.',
      tools: ['C#', 'Node.js', 'NestJS', 'Go', 'SQL Server', 'PostgreSQL'],
    },
    {
      title: 'Platform engineering',
      description: 'Linux infrastructure and delivery automation that turn deployment knowledge into a repeatable system.',
      tools: ['Linux', 'Azure', 'AWS', 'Docker', 'Ansible', 'OpenTofu', 'CI/CD'],
    },
  ],
  principles: [
    { number: '01', title: 'Earn the abstraction', description: 'Start with the real constraint. Generalize only after the pattern proves itself.' },
    { number: '02', title: 'Make the edge cases ordinary', description: 'Good systems turn failure, loading, and recovery into designed paths—not surprises.' },
    { number: '03', title: 'Leave useful evidence', description: 'Decisions, interfaces, and automation should help the next person move with confidence.' },
  ],
} satisfies Profile
