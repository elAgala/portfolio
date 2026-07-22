import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { careerEntries } from '../data/career'
import { agalaLabs, productProofs } from '../data/lab'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { resume } from '../data/resume'

describe('Agala portfolio content', () => {
  it('leads with the Agala identity and verified public products', () => {
    expect(profile.brand).toBe('Agala')
    expect(profile.organization).toBe('Agala Labs')
    expect(profile.organizationUrl).toBe('https://agala.com.ar')
    expect(profile.name).toBe('Julián Benitez')
    expect(profile.manifesto).toContain('Agala is the name people know me by')
    expect(profile.avatar).toBe('/images/julian-avatar.webp')
    expect(productProofs.map(product => product.name)).toEqual(['Smaltt', 'Kervo'])
    expect(productProofs.map(product => product.href)).toEqual([
      'https://smaltt.agala.com.ar',
      'https://kervo.agala.com.ar',
    ])
  })

  it('keeps three ordered, unique public projects', () => {
    expect(projects).toHaveLength(3)
    expect(new Set(projects.map(project => project.slug)).size).toBe(projects.length)
    expect(projects.map(project => project.order)).toEqual([1, 2, 3])
    expect(projects.map(project => project.slug)).toEqual(['agala-ui', 'agala-ai', 'agala-setup'])
    expect(JSON.stringify(projects)).not.toContain('agala-deploy')
  })

  it('keeps every project complete and source-linked', () => {
    for (const project of projects) {
      expect(project.repository).toMatch(/^https:\/\/github\.com\/elAgala\//)
      expect(project.challenge).toBeTruthy()
      expect(project.outcome).toBeTruthy()
      expect(project.approach.length).toBeGreaterThanOrEqual(3)
      expect(project.narrative.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('makes Agala Labs, its architecture, and agentic work first-class content', () => {
    expect(agalaLabs.url).toBe('https://agala.com.ar')
    expect(agalaLabs.products).toBe(productProofs)
    expect(agalaLabs.architecture.map(layer => layer.title)).toEqual([
      'Product applications',
      'Services and data',
      'Infrastructure and delivery',
    ])
    expect(agalaLabs.agenticWork.map(area => area.title)).toEqual([
      'Delivery workflow',
      'Noema',
      'AI in Agala Labs products',
    ])
    expect(agalaLabs.agenticWork.flatMap(area => area.tools)).toEqual(expect.arrayContaining([
      'Codex',
      'Claude Code',
      'OpenCode',
      'MCP',
      'OpenRouter',
    ]))

    const publicContent = JSON.stringify({ agalaLabs, profile, projects }).toLowerCase()
    expect(publicContent).not.toContain('github.com/agala-labs')
    expect(publicContent).not.toMatch(/customer count|revenue|active users|10\.10\.|(?:dev|ci|monitoring|vault|mcp)\.agala\.com\.ar/)
    expect(publicContent).not.toMatch(/both products|same self-hosted platform/)
  })

  it('uses the portrait identity in navigation and browser icons', () => {
    expect(existsSync(resolve('public/images/julian-avatar.webp'))).toBe(true)
    expect(existsSync(resolve('public/favicon.png'))).toBe(true)
    expect(existsSync(resolve('public/apple-touch-icon.png'))).toBe(true)

    const header = readFileSync(resolve('components/SiteHeader.vue'), 'utf8')
    const config = readFileSync(resolve('nuxt.config.ts'), 'utf8')
    expect(header).toContain(':src="person.avatar"')
    expect(header).toContain('site-mark__avatar')
    expect(config).toContain("href: '/favicon.png'")
    expect(config).toContain("href: '/apple-touch-icon.png'")
  })

  it('uses one career record for the portfolio and resume', () => {
    expect(resume.experience).toBe(careerEntries)
    expect(careerEntries.map(entry => entry.company)).toEqual(['AlixPartners', 'Agala Labs', 'Self-employed'])
    expect(careerEntries.every(entry => entry.portfolioBullets.length > 0)).toBe(true)
    expect(profile.email).toBe('julian@benitez.com.ar')
    expect(resume.languages.map(item => item.language)).toEqual(['Spanish', 'English'])
    expect(resume.skillGroups.find(group => group.label === 'Backend & data')?.skills).toContain('Go')
  })

  it('contains no decorative status theater or presence signals', () => {
    const componentSources = readdirSync(resolve('components'))
      .filter(file => file.endsWith('.vue'))
      .map(file => readFileSync(resolve('components', file), 'utf8'))
    const sources = [
      readFileSync(resolve('pages/index.vue'), 'utf8'),
      readFileSync(resolve('assets/css/main.css'), 'utf8'),
      ...componentSources,
    ].join('\n')

    // No borrowed operational status vocabulary.
    expect(sources).not.toMatch(/\bONLINE\b|\bOPERATIONAL\b|\bREADY\b/)
    // No presence dots, pulses, or status lamps as availability metaphors.
    expect(sources).not.toMatch(/green[-_ ]?dot|status[-_ ]?dot|presence/i)
    expect(sources).not.toMatch(/@keyframes\s+\S*pulse/i)
    // No fake IDs, shell chrome, code-like headings, or decorative build metadata.
    expect(sources).not.toMatch(/\b(?:PROD|REPO|DEC)-\d+\b|\bP-\d+\b/)
    expect(sources).not.toMatch(/featured_work|engineering_decisions|career\.log|git clone|mail -s|shipping since|whoami --verbose|80×24|data-reveal/i)
    // Availability is stated in plain language instead.
    expect(profile.availability.length).toBeGreaterThan(10)
  })
})
