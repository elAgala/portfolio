import type { AgalaLabsStory, ProductProof } from '~/types/portfolio'

export const productProofs = [
  {
    name: 'Smaltt',
    href: 'https://smaltt.agala.com.ar',
    category: 'Dental software',
    description: 'Dental practice management for appointments, patient records, odontograms, lab orders, inventory and insurer billing. Bianca assists with clinical work inside the application.',
    contribution: 'At Agala Labs, I designed and built Smaltt’s Nuxt and Vue application and services, integrated Bianca, and run it on the self-hosted platform.',
    image: '/images/agala-product-smaltt.webp',
  },
  {
    name: 'Kervo',
    href: 'https://kervo.agala.com.ar',
    category: 'Retail operations',
    description: 'Retail operations for sales, inventory, catalog, pricing, marketplace channels and business intelligence. AI workflows assist with supplier-product matching and marketing.',
    contribution: 'At Agala Labs, I designed and built Kervo’s application, service architecture and integrations, and run it on the self-hosted platform.',
    image: '/images/agala-product-kervo.webp',
  },
] satisfies ProductProof[]

export const agalaLabs = {
  name: 'Agala Labs',
  url: 'https://agala.com.ar',
  introduction: 'Agala is my nickname. Agala Labs is the software factory where I turn product ideas into software I design, build and operate.',
  responsibility: 'I own the full stack: product direction, interface design, Nuxt applications, Go services, infrastructure and delivery.',
  products: productProofs,
  architecture: [
    {
      title: 'Agala Labs products',
      description: 'Smaltt and Kervo serve different domains while sharing one engineering foundation.',
      items: ['Smaltt dental software', 'Kervo retail operations'],
    },
    {
      title: 'Shared application platform',
      description: 'Shared UI, data, gateway and integration layers keep product-specific workflows in each application without rebuilding common infrastructure.',
      items: ['Agala UI and charts', 'Go gateways for payments, billing and messaging', 'PostgreSQL and object storage', 'AI and external-service integrations'],
    },
    {
      title: 'Self-hosted delivery',
      description: 'I provision the infrastructure, configure the servers, run CI, deploy containers and operate the platform.',
      items: ['Hetzner', 'Docker Compose', 'OpenTofu', 'Ansible', 'Woodpecker CI', 'Observability and secrets'],
    },
  ],
  agenticWork: [
    {
      title: 'Delivery workflow',
      description: 'I split work into product, architecture, implementation, review, QA and repair stages. Each stage receives focused context and its own verification.',
      tools: ['Codex', 'Claude Code', 'OpenCode'],
    },
    {
      title: 'Agent tooling',
      description: 'Agala AI packages those workflows as readable agents, skills and stack guides. Agala Context provides a catalog-backed MCP service so coding agents can retrieve current architecture and ownership information.',
      tools: ['Agents', 'Skills', 'Stack guides', 'MCP'],
    },
    {
      title: 'AI in Agala Labs products',
      description: 'Bianca supports clinical work in Smaltt. Kervo uses AI for supplier-product matching and marketing workflows. Each capability is integrated into the product workflow.',
      tools: ['OpenRouter', 'Structured workflows', 'Product integrations'],
    },
  ],
} satisfies AgalaLabsStory
