import { describe, expect, it } from 'vitest'
import { evidenceGraphs } from '../data/experience-graphs'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { resume } from '../data/resume'
import { chooseKernelQuality, clampKernelPointer, validateEvidenceGraph } from '../utils/workbench'

describe('portfolio content', () => {
  it('keeps three ordered, unique featured case studies', () => {
    expect(projects).toHaveLength(3)
    expect(new Set(projects.map(project => project.slug)).size).toBe(projects.length)
    expect(projects.map(project => project.order)).toEqual([1, 2, 3])
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
})

describe('kernel machine policy', () => {
  it('selects an adaptive rendering tier', () => {
    expect(chooseKernelQuality({ reducedMotion: true, webglAvailable: true, viewportWidth: 1440, devicePixelRatio: 1 })).toBe('fallback')
    expect(chooseKernelQuality({ reducedMotion: false, webglAvailable: false, viewportWidth: 1440, devicePixelRatio: 1 })).toBe('fallback')
    expect(chooseKernelQuality({ reducedMotion: false, webglAvailable: true, viewportWidth: 390, devicePixelRatio: 3 })).toBe('balanced')
    expect(chooseKernelQuality({ reducedMotion: false, webglAvailable: true, viewportWidth: 1440, devicePixelRatio: 1, hardwareConcurrency: 12 })).toBe('high')
  })

  it('constrains pointer input to the intended orbit range', () => {
    expect(clampKernelPointer(-4)).toBe(-1)
    expect(clampKernelPointer(0.4)).toBe(0.4)
    expect(clampKernelPointer(9)).toBe(1)
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
