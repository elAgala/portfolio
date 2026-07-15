import { describe, expect, it, vi } from 'vitest'
import * as THREE from 'three'
import { createEvidenceGraph } from '../components/experience/graphs'
import { disposeObject3D } from '../components/experience/runtime/disposal'
import { evidenceGraphs } from '../data/experience-graphs'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { resume } from '../data/resume'
import { cameraKeyframes, estateAssets, experienceChapters } from '../data/experience'
import { chooseExperienceQuality, evaluateCameraKeyframes, evaluateEvidenceGraphPhase, graphLocalProgress, interpolateExperienceStage, isEvidenceEdgeActive, parseSoundPreference, resolveExperiencePresentation, shouldRunExperienceIntro, validateAssetManifest, validateEvidenceGraph } from '../utils/experience'

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

  it('exposes verified contact and resume information', () => {
    expect(profile.email).toBe('julian@benitez.com.ar')
    expect(profile.links.some(link => link.url === 'https://github.com/elAgala')).toBe(true)
    expect(resume.experience[0]?.company).toBe('AlixPartners')
    expect(resume.languages.map(item => item.language)).toEqual(['Spanish', 'English'])
  })
})

describe('cinematic experience', () => {
  it('selects an adaptive rendering tier', () => {
    expect(chooseExperienceQuality({ reducedMotion: true, webglAvailable: true, viewportWidth: 1440, devicePixelRatio: 1 })).toBe('fallback')
    expect(chooseExperienceQuality({ reducedMotion: false, webglAvailable: false, viewportWidth: 1440, devicePixelRatio: 1 })).toBe('fallback')
    expect(chooseExperienceQuality({ reducedMotion: false, webglAvailable: true, softwareRenderer: true, viewportWidth: 1440, devicePixelRatio: 1 })).toBe('fallback')
    expect(chooseExperienceQuality({ reducedMotion: false, webglAvailable: true, viewportWidth: 390, devicePixelRatio: 3 })).toBe('balanced')
    expect(chooseExperienceQuality({ reducedMotion: false, webglAvailable: true, viewportWidth: 1440, devicePixelRatio: 1, hardwareConcurrency: 12 })).toBe('high')
  })

  it('smoothly maps semantic stages to the camera journey', () => {
    const stages = [
      { chapter: 'hero' as const, center: 500, cameraX: 0 },
      { chapter: 'agala-ui' as const, center: 1500, cameraX: 18 },
      { chapter: 'agala-deploy' as const, center: 2500, cameraX: 36 },
    ]
    expect(interpolateExperienceStage(stages, 500)).toMatchObject({ cameraX: 0, chapter: 'hero', progress: 0 })
    expect(interpolateExperienceStage(stages, 1000)).toMatchObject({ cameraX: 9, chapter: 'agala-ui' })
    expect(interpolateExperienceStage(stages, 2500)).toMatchObject({ cameraX: 36, chapter: 'agala-deploy', progress: 1 })
  })

  it('keeps the authored estate manifests and camera journey valid', () => {
    expect(validateAssetManifest(estateAssets.high)).toBe(true)
    expect(validateAssetManifest(estateAssets.balanced)).toBe(true)
    expect(experienceChapters[0]?.start).toBe(0)
    expect(experienceChapters.at(-1)?.end).toBe(1)
    expect(experienceChapters.every((item, index) => index === 0 || item.start >= experienceChapters[index - 1]!.end)).toBe(true)

    const start = evaluateCameraKeyframes(cameraKeyframes, 0)
    const middle = evaluateCameraKeyframes(cameraKeyframes, 0.5)
    const end = evaluateCameraKeyframes(cameraKeyframes, 1)
    expect(start.position).toEqual(cameraKeyframes[0]!.position)
    expect(middle.progress).toBe(0.5)
    expect(end.position).toEqual(cameraKeyframes.at(-1)!.position)
  })

  it('runs the threshold reveal only for a fresh, direct homepage visit', () => {
    expect(shouldRunExperienceIntro({ reducedMotion: false, hasSeenIntro: false, hash: '' })).toBe(true)
    expect(shouldRunExperienceIntro({ reducedMotion: false, hasSeenIntro: false, hash: '#work' })).toBe(false)
    expect(shouldRunExperienceIntro({ reducedMotion: false, hasSeenIntro: true, hash: '' })).toBe(false)
    expect(shouldRunExperienceIntro({ reducedMotion: true, hasSeenIntro: false, hash: '' })).toBe(false)
    expect(shouldRunExperienceIntro({ reducedMotion: false, hasSeenIntro: true, hash: '#contact', force: true })).toBe(true)
  })

  it('maps loading, cinematic, static, and session sound states deterministically', () => {
    expect(resolveExperiencePresentation({ quality: 'high', ready: false, failed: false })).toBe('loading')
    expect(resolveExperiencePresentation({ quality: 'balanced', ready: true, failed: false })).toBe('cinematic')
    expect(resolveExperiencePresentation({ quality: 'fallback', ready: false, failed: false })).toBe('static')
    expect(resolveExperiencePresentation({ quality: 'high', ready: true, failed: true })).toBe('static')
    expect(parseSoundPreference('true')).toBe(true)
    expect(parseSoundPreference('false')).toBe(false)
    expect(parseSoundPreference(null)).toBe(false)
  })

  it('releases scene geometry and materials during route teardown', () => {
    const parent = new THREE.Group()
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial()
    const geometryDispose = vi.spyOn(geometry, 'dispose')
    const materialDispose = vi.spyOn(material, 'dispose')
    const root = new THREE.Group()
    root.add(new THREE.Mesh(geometry, material))
    parent.add(root)

    disposeObject3D(root)

    expect(geometryDispose).toHaveBeenCalledOnce()
    expect(materialDispose).toHaveBeenCalledOnce()
    expect(root.parent).toBeNull()
  })
})

describe('project evidence graphs', () => {
  it('keeps every graph valid and aligned with the verified project records', () => {
    expect(evidenceGraphs.map(graph => graph.id)).toEqual(projects.map(project => project.slug))
    for (const graph of evidenceGraphs) {
      const project = projects.find(item => item.slug === graph.id)!
      expect(validateEvidenceGraph(graph)).toEqual([])
      expect(graph.title).toBe(project.title)
      expect(graph.nodes.every(node => Object.hasOwn(project, node.metadataRef.split('.')[0]!))).toBe(true)
      expect(new Set(graph.nodes.map(node => node.label)).size).toBe(graph.nodes.length)
    }
  })

  it('evaluates phases and edge activation deterministically in both directions', () => {
    const definition = evidenceGraphs[0]!
    const forward = evaluateEvidenceGraphPhase(definition, 0.82)
    const reverse = evaluateEvidenceGraphPhase(definition, 0.18)
    expect(forward.phase.id).toBe('workflow')
    expect(reverse.phase.id).toBe('language')
    expect(graphLocalProgress(0.245, 0.16, 0.33)).toBeCloseTo(0.5)
    expect(isEvidenceEdgeActive(definition, definition.edges.at(-1)!, 0.4)).toBe(false)
    expect(isEvidenceEdgeActive(definition, definition.edges.at(-1)!, 0.8)).toBe(true)
  })

  it('pauses inactive graphs, supports balanced final frames, and disposes cleanly', () => {
    const graph = createEvidenceGraph(evidenceGraphs[1]!, 'high')
    const anchor = new THREE.Group()
    anchor.name = 'AnchorAgalaDeploy'
    anchor.add(graph.root)
    expect(graph.root.visible).toBe(false)

    graph.setActive(true)
    graph.setProgress(0.45)
    graph.update(1)
    const activeStats = graph.stats()
    expect(activeStats.active).toBe(true)
    expect(activeStats.activeInstances).toBeGreaterThan(0)

    graph.setActive(false)
    const updates = graph.stats().updates
    graph.update(2)
    expect(graph.stats().updates).toBe(updates)

    graph.setActive(true)
    graph.setQuality('balanced')
    graph.setProgress(0.1)
    expect(graph.stats().activeInstances).toBe(evidenceGraphs[1]!.nodes.length)
    graph.dispose()
    expect(graph.root.parent).toBeNull()
  })

  it('keeps the combined graph geometry inside the shared estate budget', () => {
    const graphs = evidenceGraphs.map(definition => createEvidenceGraph(definition, 'high'))
    const totalTriangles = graphs.reduce((sum, graph) => sum + graph.stats().triangles, 0)
    expect(totalTriangles).toBeLessThan(30_000)
    graphs.forEach(graph => graph.dispose())
  })
})
