import type { AgalaLabsStory, ProductProof } from '~/types/portfolio'

export const productProofs = [
  {
    name: 'Smaltt',
    href: 'https://smaltt.agala.com.ar',
    category: 'Dental software',
    description: 'Dental practice management for appointments, patient records, odontograms, lab orders, inventory and insurer billing. Bianca assists with clinical work inside the application.',
    contribution: 'My work on Smaltt spans patient and clinical workflows, insurer and lab operations, Bianca, and the services that keep the product running.',
    image: '/images/agala-product-smaltt.webp',
  },
  {
    name: 'Kervo',
    href: 'https://kervo.agala.com.ar',
    category: 'Retail operations',
    description: 'Retail operations for sales, inventory, catalog, pricing, marketplace channels and business intelligence. AI workflows assist with supplier-product matching and marketing.',
    contribution: 'I took Kervo from product and interface design through its inventory, marketplace and analytics architecture, integrations and production operations.',
    image: '/images/agala-product-kervo.webp',
  },
] satisfies ProductProof[]

export const agalaLabs = {
  name: 'Agala Labs',
  url: 'https://agala.com.ar',
  introduction: 'Agala is my nickname. Agala Labs is the software factory where I turn product ideas into software I design, build and operate.',
  responsibility: 'I own the full stack: product direction, interface design, applications, services, infrastructure and delivery.',
  products: productProofs,
  architecture: [
    {
      title: 'Product applications',
      description: 'Smaltt and Kervo are separate applications for different domains, built from a shared interface foundation.',
      items: ['Nuxt', 'Vue', 'TypeScript', 'Agala UI', 'Agala Charts'],
    },
    {
      title: 'Services and data',
      description: 'Focused services connect product workflows to payments, billing, messaging, storage and AI providers.',
      items: ['Go', 'PostgreSQL', 'Object storage', 'Payments and billing', 'Messaging', 'OpenRouter'],
    },
    {
      title: 'Infrastructure and delivery',
      description: 'I provision the servers, run CI, deploy containers and operate the self-hosted platform.',
      items: ['Hetzner', 'Linux', 'Docker Compose', 'OpenTofu', 'Ansible', 'Woodpecker CI', 'Observability', 'Secrets management'],
    },
  ],
  agenticWork: [
    {
      title: 'Delivery workflow',
      description: 'For complex work, I assign clear roles for planning, implementation, review and QA, with human decisions and executable checks between stages.',
      tools: ['Codex', 'Claude Code', 'OpenCode'],
    },
    {
      title: 'Noema',
      description: 'Noema is my private cognitive system. Through Telegram and MCP, it turns intent into Plane work, captures ideas and notes in SiYuan, and gives coding agents bounded project context and knowledge tools.',
      tools: ['Go', 'MCP', 'Telegram', 'Plane', 'SiYuan', 'PostgreSQL'],
    },
    {
      title: 'AI in Agala Labs products',
      description: 'Bianca supports clinical work in Smaltt. Kervo uses AI for supplier-product matching and marketing workflows. Each capability is integrated into the product workflow.',
      tools: ['OpenRouter', 'Structured workflows', 'Product integrations'],
    },
  ],
} satisfies AgalaLabsStory
