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
  summary: 'Software engineer and tech lead in Buenos Aires. I lead distributed product teams at AlixPartners and run Agala Labs, where I design and operate Smaltt, Kervo and the shared platform behind them.',
  manifesto: 'Agala is the name people know me by. I lead distributed product teams at AlixPartners and run Agala Labs, where I design and operate Smaltt, Kervo and the shared platform behind them.',
  avatar: '/images/julian-avatar.webp',
  links: [
    { label: 'GitHub', url: 'https://github.com/elAgala' },
    { label: 'Agala Labs', url: 'https://agala.com.ar' },
    { label: 'Email', url: 'mailto:julian@benitez.com.ar' },
    { label: 'Resume', url: '/resume' },
  ],
} satisfies Profile
