import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { careerEntries, experienceSignals } from '../data/career'
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
    expect(profile.title).toBe('Technical Lead / Software Engineer')
    expect(profile.manifesto).toContain('I lead distributed product teams at AlixPartners')
    expect(profile.manifesto).not.toContain('people know me by')
    expect(profile.avatar).toBe('/images/julian-avatar.webp')
    expect(productProofs.map(product => product.name)).toEqual(['Smaltt', 'Kervo'])
    expect(productProofs.map(product => product.href)).toEqual([
      'https://smaltt.agala.com.ar',
      'https://kervo.agala.com.ar',
    ])
  })

  it('keeps two ordered, unique public projects', () => {
    expect(projects).toHaveLength(2)
    expect(new Set(projects.map(project => project.slug)).size).toBe(projects.length)
    expect(projects.map(project => project.order)).toEqual([1, 2])
    expect(projects.map(project => project.slug)).toEqual(['agala-ui', 'agala-setup'])
    expect(JSON.stringify(projects)).not.toContain('agala-deploy')
  })

  it('keeps every project complete and source-linked', () => {
    expect(projects.map(project => project.repository)).toEqual([
      'https://github.com/agala-labs/ui',
      'https://github.com/elAgala/agala-setup',
    ])

    for (const project of projects) {
      expect(project.repository).toMatch(/^https:\/\/github\.com\//)
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
    expect(config).toContain("href: '/favicon.png?v=opendesign'")
    expect(config).toContain("href: '/apple-touch-icon.png?v=opendesign'")
  })

  it('uses one career record for the portfolio and resume', () => {
    expect(resume.experience).toBe(careerEntries)
    expect(resume.experience[0]?.dates).toBe('2021–Present')
    expect(resume.experience[0]?.positions.map(({ role, dates }) => ({ role, dates }))).toEqual([
      { role: 'Technical Lead / Software Engineer', dates: '2024–Present' },
      { role: 'Software Engineer', dates: '2021–2024' },
    ])
    expect(resume.headline).toBe('Technical Lead · Hands-on Software Engineer')
    expect(careerEntries.map(entry => entry.company)).toEqual(['AlixPartners', 'Agala Labs'])
    expect(careerEntries[1]?.location).toBe('Independent product engineering')
    expect(careerEntries[0]?.stack).toEqual(expect.arrayContaining(['Kafka', 'Redis']))
    expect(experienceSignals.map(signal => signal.title)).toEqual([
      'Lead multidisciplinary teams',
      'Build the foundations',
      'Improve the delivery loop',
    ])
    expect(experienceSignals[0]?.detail).toContain('technical direction of multidisciplinary product teams')
    expect(experienceSignals[0]?.detail).toContain('spanning Argentina, the US, and Europe')
    expect(profile.email).toBe('julian@benitez.com.ar')
    expect(resume.languages.map(item => item.language)).toEqual(['Spanish', 'English'])
    expect(resume.summary).toContain('Hands-on technical lead')
    expect(resume.summary).not.toMatch(/AlixPartners|Agala Labs/)
    expect(resume.experience[0]?.positions[0]?.bullets[0]).toContain('client-facing and internal tools from the ground up')
    expect(resume.experience[0]?.positions[0]?.bullets[1]).toContain('shared design-system library')
    expect(resume.experience[0]?.positions[0]?.bullets[1]).toContain('across the organization')
    expect(resume.experience[0]?.positions[0]?.bullets[2]).toContain('systems owned by different teams')
    expect(resume.education.map(item => item.degree)).toEqual([
      'Computer Engineering — in progress',
      'Computer Engineering coursework',
    ])
    expect(resume.education[1]?.detail).toBe('Five semesters completed')
    expect(resume.skillGroups.find(group => group.label === 'Backend & Data')?.skills).toContain('Go')
    expect(resume.skillGroups.find(group => group.label === 'Backend & Data')?.skills).toEqual(expect.arrayContaining(['Kafka', 'Redis']))
    expect(resume.skillGroups.find(group => group.label === 'Observability')?.skills).toEqual(['Prometheus', 'Grafana'])
    expect(resume.skillGroups.find(group => group.label === 'Platform & Delivery')?.skills).toContain('OpenTofu')
    expect(resume.languages.find(item => item.language === 'English')?.level).toBe('Professional working proficiency')
  })

  it('uses the OpenDesign homepage and retains complete career records', () => {
    const homepage = readFileSync(resolve('pages/index.vue'), 'utf8')
    const career = readFileSync(resolve('components/CareerSection.vue'), 'utf8')
    const labs = readFileSync(resolve('components/AgalaLabsSection.vue'), 'utf8')

    expect(homepage).toContain('<PortfolioDesign />')
    const design = readFileSync(resolve('components/PortfolioDesign.vue'), 'utf8')
    expect(design).toContain('I lead by building.')
    expect(design).toContain('href="/resume"')
    expect(design.indexOf('id="identity"')).toBeLessThan(design.indexOf('id="systems"'))
    expect(career).toContain('entry.positions')
    expect(career).toContain('position.bullets')
    expect(career).toContain('entry.stack')
    expect(careerEntries[0]?.stack).toEqual(expect.arrayContaining(['React', 'Next.js', 'Vue']))
    expect(labs).not.toContain('story.architecture')
    expect(labs).not.toContain('story.agenticWork')
  })

  it('ships the hero hidden before client-side animation starts', () => {
    const hero = readFileSync(resolve('components/PortfolioDesign.vue'), 'utf8')
    const styles = readFileSync(resolve('assets/css/portfolio.css'), 'utf8')
    const runtime = readFileSync(resolve('utils/portfolio.ts'), 'utf8')

    expect(hero).toContain("document.documentElement.classList.add('booting')")
    expect(hero).toContain('prefers-reduced-motion: reduce')
    expect(styles).toContain('html.booting .hero > .hero-main')
    expect(runtime).toContain('onComplete')
  })

  it('keeps homepage calls to action aligned with real section targets', () => {
    const design = readFileSync(resolve('components/PortfolioDesign.vue'), 'utf8')
    const styles = readFileSync(resolve('assets/css/portfolio.css'), 'utf8')
    expect(design).toMatch(/class="text-link" href="#contact"/)
    expect(design).toMatch(/class="text-link" href="#systems"/)
    expect(styles).not.toMatch(/\[id\]\s*\{\s*scroll-margin-top/)
    expect(design).toContain('Listen to some house music I like')
  })

  it('renders company history with nested positions and skills before education', () => {
    const source = readFileSync(resolve('pages/resume.vue'), 'utf8')
    expect(source).toContain('<h3>{{ item.company }}</h3>')
    expect(source).toContain('v-for="position in item.positions"')
    expect(source).toContain('<h4>{{ position.role }}</h4>')
    expect(source.indexOf('<h2>Technical skills</h2>')).toBeLessThan(source.indexOf('<h2>Education</h2>'))
  })

  it('opens the resume separately without a return link', () => {
    const resumePage = readFileSync(resolve('pages/resume.vue'), 'utf8')
    const homepage = readFileSync(resolve('components/PortfolioDesign.vue'), 'utf8')
    expect(resumePage).not.toContain('Back to portfolio')
    expect(resumePage).not.toMatch(/(?:href|to)="\/"/)
    const resumeLinks = homepage.match(/<a\b[^>]*href="\/resume"[^>]*>/g) ?? []
    expect(resumeLinks).toHaveLength(2)
    for (const link of resumeLinks) expect(link).toContain('target="_blank"')
    expect(resumePage).toContain('@click="printResume"')
    expect(resumePage).toContain('href="/julian-benitez-resume.pdf" download')
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
