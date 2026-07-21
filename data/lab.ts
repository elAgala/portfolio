import type { AgalaLabsStory, ProductProof } from '~/types/portfolio'

export const productProofs = [
  {
    name: 'Smaltt',
    href: 'https://smaltt.agala.com.ar',
    category: 'Dental software',
    description: 'Practice management software for dental clinics: appointments, patients, odontograms, lab orders, stock and insurer billing. Bianca adds an AI clinical assistant inside the same workflow.',
    contribution: 'I designed the product, built its Nuxt and Vue application and services, integrated its AI features, and operate its delivery on the Agala platform.',
    image: '/images/agala-product-smaltt.webp',
  },
  {
    name: 'Kervo',
    href: 'https://kervo.agala.com.ar',
    category: 'Retail operations',
    description: 'Retail operations software for sales, stock, catalog, pricing, marketplace channels and business intelligence, including AI-assisted product matching and marketing work.',
    contribution: 'I designed the product and its architecture, built the application and integrations, and operate its deployment on the same self-hosted platform.',
    image: '/images/agala-product-kervo.webp',
  },
] satisfies ProductProof[]

export const agalaLabs = {
  name: 'Agala Labs',
  url: 'https://agala.com.ar',
  introduction: 'Agala is my nickname. Agala Labs is the software factory I built to turn my own ideas into products I can run and keep improving.',
  responsibility: 'I handle the work end to end: product definition, interface design, application and service architecture, delivery, and operations.',
  products: productProofs,
  architecture: [
    {
      title: 'Products',
      description: 'Smaltt and Kervo are separate products for different kinds of work, built and operated on the same engineering foundation.',
      items: ['Smaltt dental software', 'Kervo retail operations'],
    },
    {
      title: 'Shared product platform',
      description: 'The reusable parts live below the applications, so product-specific workflows stay in the products while common behavior is maintained once.',
      items: ['Agala UI and charts', 'Go gateways for payments, billing and messaging', 'PostgreSQL and object storage', 'AI and external-service integrations'],
    },
    {
      title: 'Self-hosted delivery',
      description: 'I provision the infrastructure, configure the servers, run CI and deploy the containers myself.',
      items: ['Hetzner', 'Docker Compose', 'OpenTofu', 'Ansible', 'Woodpecker CI', 'Monitoring and secrets management'],
    },
  ],
  agenticWork: [
    {
      title: 'How I work with agents',
      description: 'I use explicit product, architecture, implementation, review, QA and repair stages. Each stage has its own context and verification instead of asking one long-running agent to improvise the whole job.',
      tools: ['Codex', 'Claude Code', 'OpenCode'],
    },
    {
      title: 'The tooling I built',
      description: 'Agala AI packages those workflows as readable agents, skills and stack guides. Agala Context adds a catalog-backed MCP service so coding agents can retrieve current architecture and ownership information.',
      tools: ['Agents', 'Skills', 'Stack guides', 'MCP'],
    },
    {
      title: 'AI inside products',
      description: 'Smaltt includes Bianca, an assistant for clinical work. Kervo uses AI for supplier-product matching and marketing workflows. These features live inside the product flow rather than in a separate demo.',
      tools: ['OpenRouter', 'Structured workflows', 'Product integrations'],
    },
  ],
} satisfies AgalaLabsStory
