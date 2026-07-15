export interface Link {
  label: string
  url: string
}

export interface Profile {
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
  capabilities: Array<{
    title: string
    description: string
    tools: string[]
  }>
  principles: Array<{
    number: string
    title: string
    description: string
  }>
}

export interface Resume {
  summary: string
  experience: Array<{
    dates: string
    role: string
    company: string
    location?: string
    bullets: string[]
  }>
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
  path: string
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
