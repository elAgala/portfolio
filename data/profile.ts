import type { Profile } from '~/types/portfolio'

export const profile = {
  brand: 'Agala',
  organization: 'Agala Labs',
  organizationUrl: 'https://agala.com.ar',
  name: 'Julián Benitez',
  initials: 'A',
  title: 'Software Engineer / Tech Lead',
  location: 'Buenos Aires, Argentina',
  availability: 'Open to the right engineering challenge',
  email: 'julian@benitez.com.ar',
  website: 'julian.benitez.ar',
  summary: 'Software engineer and tech lead in Buenos Aires. I lead product teams at AlixPartners and run Agala Labs, my independent software factory.',
  manifesto: 'Agala is the name people know me by. I lead product teams at AlixPartners and run Agala Labs, my software factory. There I design products, build the applications and services behind them, and operate the platform they run on.',
  avatar: '/images/julian-portrait.webp',
  links: [
    { label: 'GitHub', url: 'https://github.com/elAgala' },
    { label: 'Agala Labs', url: 'https://agala.com.ar' },
    { label: 'Email', url: 'mailto:julian@benitez.com.ar' },
    { label: 'Resume', url: '/resume' },
  ],
} satisfies Profile
