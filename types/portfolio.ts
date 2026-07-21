export interface Link {
  label: string
  url: string
}

export interface Profile {
  brand: string
  organization: string
  organizationUrl: string
  name: string
  initials: string
  title: string
  location: string
  availability: string
  email: string
  website: string
  summary: string
  manifesto: string
  avatar: string
  links: Link[]
}

export interface ProductProof {
  name: string
  href: string
  category: string
  description: string
  contribution: string
  image: string
}

export interface AgalaLabsStory {
  name: string
  url: string
  introduction: string
  responsibility: string
  products: ProductProof[]
  architecture: Array<{
    title: string
    description: string
    items: string[]
  }>
  agenticWork: Array<{
    title: string
    description: string
    tools: string[]
  }>
}

export interface CareerLayer {
  label: string
  detail: string
  tools: string[]
}

export interface CareerEntry {
  dates: string
  role: string
  company: string
  location?: string
  summary: string
  bullets: string[]
  portfolioSummary: string
  portfolioBullets: string[]
  stack: string[]
  layers?: CareerLayer[]
}

export interface Resume {
  summary: string
  experience: CareerEntry[]
  education: Array<{
    dates: string
    degree: string
    institution: string
    detail?: string
  }>
  skillGroups: Array<{
    label: string
    skills: string[]
  }>
  languages: Array<{
    language: string
    level: string
  }>
}

export interface Project {
  slug: string
  title: string
  description: string
  order: number
  featured: boolean
  year: string
  role: string
  eyebrow: string
  repository: string
  stack: string[]
  outcome: string
  challenge: string
  approach: string[]
  narrative: Array<{
    title: string
    paragraphs?: string[]
    points?: string[]
  }>
}
