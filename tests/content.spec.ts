import { describe, expect, it } from 'vitest'
import { careerEntries } from '../data/career'
import { evidenceGraphs } from '../data/experience-graphs'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { resume } from '../data/resume'
import { completeTerminalInput, runTerminalCommand, type TerminalContext } from '../utils/terminal'
import { chooseHeroSceneQuality, clampHeroPointer, validateEvidenceGraph } from '../utils/workbench'

const terminalContext: TerminalContext = {
  name: profile.name,
  title: profile.title,
  location: profile.location,
  email: profile.email,
  github: 'https://github.com/elAgala',
  projects: projects.map(project => ({
    slug: project.slug,
    title: project.title,
    path: project.path,
    repository: project.repository,
  })),
  experience: careerEntries.map(entry => ({
    dates: entry.dates,
    role: entry.role,
    company: entry.company,
    summary: entry.summary,
  })),
}

describe('portfolio content', () => {
  it('keeps four ordered, unique featured case studies', () => {
    expect(projects).toHaveLength(4)
    expect(new Set(projects.map(project => project.slug)).size).toBe(projects.length)
    expect(projects.map(project => project.order)).toEqual([1, 2, 3, 4])
    expect(projects.every(project => project.featured)).toBe(true)
  })

  it('keeps every case study implementation-ready', () => {
    for (const project of projects) {
      expect(project.path).toBe(`/work/${project.slug}`)
      expect(project.repository).toMatch(/^https:\/\/github\.com\/elAgala\//)
      expect(project.approach.length).toBeGreaterThanOrEqual(3)
      expect(project.narrative.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('exposes verified contact and résumé information', () => {
    expect(profile.email).toBe('julian@benitez.com.ar')
    expect(profile.avatar).toBe('/images/julian-portrait.webp')
    expect(profile.links.some(link => link.url === 'https://github.com/elAgala')).toBe(true)
    expect(resume.experience[0]?.company).toBe('AlixPartners')
    expect(resume.languages.map(item => item.language)).toEqual(['Spanish', 'English'])
  })

  it('uses one career record for the portfolio and résumé', () => {
    expect(resume.experience).toBe(careerEntries)
    expect(careerEntries.map(entry => entry.company)).toEqual(['AlixPartners', 'Agala Labs', 'Self-employed'])

    const alix = careerEntries[0]!
    expect(alix.role).toBe('Software Engineer / Tech Lead')
    expect(alix.bullets.join(' ')).toMatch(/Frontend Guild/)
    expect(alix.bullets.join(' ')).toMatch(/technical interviews/)
    expect(alix.stack).toEqual(expect.arrayContaining(['Next.js', 'React', 'Vue', 'C#']))
  })

  it('keeps Agala Labs evidence factual and privacy-safe', () => {
    const lab = careerEntries.find(entry => entry.company === 'Agala Labs')!
    const publicContent = JSON.stringify({ profile, projects, resume }).toLowerCase()
    const labClaims = JSON.stringify(lab).toLowerCase()

    expect(lab.role).toBe('Creator / Software Engineer')
    expect(lab.layers?.map(layer => layer.label)).toEqual(['Product surfaces', 'Services', 'Platform'])
    expect(publicContent).not.toContain('github.com/agala-labs')
    expect(labClaims).not.toMatch(/founder|client|customer|revenue|user count/)
  })
})

describe('operator desk policy', () => {
  it('selects an adaptive rendering tier', () => {
    expect(chooseHeroSceneQuality({ reducedMotion: true, webglAvailable: true, viewportWidth: 1440, devicePixelRatio: 1 })).toBe('fallback')
    expect(chooseHeroSceneQuality({ reducedMotion: false, webglAvailable: false, viewportWidth: 1440, devicePixelRatio: 1 })).toBe('fallback')
    expect(chooseHeroSceneQuality({ reducedMotion: false, webglAvailable: true, viewportWidth: 390, devicePixelRatio: 3 })).toBe('balanced')
    expect(chooseHeroSceneQuality({ reducedMotion: false, webglAvailable: true, viewportWidth: 1440, devicePixelRatio: 1, hardwareConcurrency: 12 })).toBe('high')
  })

  it('constrains pointer input to restrained parallax', () => {
    expect(clampHeroPointer(-4)).toBe(-1)
    expect(clampHeroPointer(0.4)).toBe(0.4)
    expect(clampHeroPointer(9)).toBe(1)
  })

})

describe('project evidence diagrams', () => {
  it('keeps every diagram valid and aligned with its project record', () => {
    expect(evidenceGraphs.map(graph => graph.id)).toEqual(projects.map(project => project.slug))
    for (const graph of evidenceGraphs) {
      const project = projects.find(item => item.slug === graph.id)!
      expect(validateEvidenceGraph(graph)).toEqual([])
      expect(graph.title).toBe(project.title)
      expect(graph.nodes.every(node => Object.hasOwn(project, node.metadataRef.split('.')[0]!))).toBe(true)
      expect(new Set(graph.nodes.map(node => node.label)).size).toBe(graph.nodes.length)
    }
  })
})

describe('portfolio terminal', () => {
  it('routes explicit commands without evaluating arbitrary input', () => {
    expect(runTerminalCommand('open agala-ui', terminalContext).action).toEqual({ type: 'navigate', target: '/work/agala-ui' })
    expect(runTerminalCommand('source agala-deploy', terminalContext).action).toEqual({ type: 'external', target: 'https://github.com/elAgala/agala-deploy' })
    expect(runTerminalCommand('resume', terminalContext).action).toEqual({ type: 'navigate', target: '/resume' })
    expect(runTerminalCommand('clear', terminalContext).action).toEqual({ type: 'clear' })
    expect(runTerminalCommand('experience', terminalContext).output.join(' ')).toContain('Software Engineer / Tech Lead')
    expect(runTerminalCommand('lab', terminalContext).output.join(' ')).toContain('products private')
    expect(runTerminalCommand('process.exit()', terminalContext).output[0]).toContain('command not found')
  })

  it('lists targets, reports invalid targets, and completes commands', () => {
    expect(runTerminalCommand('projects', terminalContext).output).toHaveLength(4)
    expect(runTerminalCommand('open missing', terminalContext).output.join(' ')).toContain('target not found')
    expect(completeTerminalInput('who', terminalContext)).toBe('whoami')
    expect(completeTerminalInput('open agala-d', terminalContext)).toBe('open agala-deploy')
    expect(completeTerminalInput('open agala-s', terminalContext)).toBe('open agala-setup')
  })
})
