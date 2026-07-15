import type { Profile } from '~/types/portfolio'

export const profile = {
  name: 'Julián Benitez',
  initials: 'JB',
  title: 'Software Engineer',
  location: 'Buenos Aires, Argentina',
  availability: 'Open to ambitious engineering work',
  email: 'julian@benitez.com.ar',
  website: 'julian.benitez.ar',
  summary: 'I design and build maintainable software across product interfaces, backend systems, and the infrastructure that carries them into production.',
  manifesto: 'The best systems feel inevitable. Clear boundaries. Useful abstractions. No ceremony without purpose. I work close to the hard decisions and stay until the details hold.',
  avatar: 'https://avatars.githubusercontent.com/u/62021513?v=4',
  links: [
    { label: 'GitHub', url: 'https://github.com/elAgala' },
    { label: 'Email', url: 'mailto:julian@benitez.com.ar' },
    { label: 'Résumé', url: '/resume' },
  ],
  capabilities: [
    {
      title: 'Product engineering',
      description: 'Interfaces that make complicated work feel direct, with systems that remain maintainable after launch.',
      tools: ['Vue', 'Nuxt', 'TypeScript', 'Flutter'],
    },
    {
      title: 'Backend systems',
      description: 'Practical APIs and services shaped around clear contracts, operational safety, and fast delivery.',
      tools: ['Node.js', 'NestJS', 'C#', 'Go'],
    },
    {
      title: 'Platform craft',
      description: 'Delivery tooling and Linux infrastructure that turn deployment from tribal knowledge into a repeatable system.',
      tools: ['Azure', 'AWS', 'Ansible', 'Docker'],
    },
  ],
  principles: [
    { number: '01', title: 'Earn the abstraction', description: 'Start with the real constraint. Generalize only after the pattern proves itself.' },
    { number: '02', title: 'Make the edge cases ordinary', description: 'Good systems turn failure, loading, and recovery into designed paths—not surprises.' },
    { number: '03', title: 'Leave useful evidence', description: 'Decisions, interfaces, and automation should help the next person move with confidence.' },
  ],
} satisfies Profile
