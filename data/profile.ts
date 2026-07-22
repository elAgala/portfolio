import type { Profile } from '~/types/portfolio'

export const profile = {
  brand: 'Agala',
  organization: 'Agala Labs',
  organizationUrl: 'https://agala.com.ar',
  name: 'Julián Benitez',
  initials: 'A',
  title: 'Technical Lead / Software Engineer',
  location: 'Buenos Aires, Argentina',
  availability: 'Open to the right engineering challenge',
  email: 'julian@benitez.com.ar',
  website: 'julian.benitez.ar',
  summary: 'Software engineer and tech lead in Buenos Aires. I lead distributed product teams at AlixPartners and run Agala Labs, where I design and operate Smaltt, Kervo and the shared platform behind them.',
  manifesto: 'I lead distributed product teams at AlixPartners. At Agala Labs, I design and operate Smaltt, Kervo and the platform they share.',
  avatar: '/images/julian-avatar.webp',
  links: [
    { label: 'GitHub', url: 'https://github.com/elAgala' },
    { label: 'Agala Labs', url: 'https://agala.com.ar' },
    { label: 'Email', url: 'mailto:julian@benitez.com.ar' },
    { label: 'Resume', url: '/resume' },
  ],
} satisfies Profile
