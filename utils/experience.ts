import type { CameraKeyframe, EvidenceEdge, EvidenceGraphDefinition, EvidenceGraphState, ExperienceChapter, ExperiencePresentation, ExperienceQuality, ExperienceStage, SceneAssetManifest } from '~/types/experience'

export type { ExperienceChapter, ExperienceQuality, ExperienceStage } from '~/types/experience'

export interface ExperienceCapabilityInput {
  reducedMotion: boolean
  webglAvailable: boolean
  softwareRenderer?: boolean
  viewportWidth: number
  devicePixelRatio: number
  hardwareConcurrency?: number
}

export interface ExperienceIntroInput {
  reducedMotion: boolean
  hasSeenIntro: boolean
  hash: string
  force?: boolean
}

export interface ExperiencePresentationInput {
  quality: ExperienceQuality
  ready: boolean
  failed: boolean
}

export function chooseExperienceQuality(input: ExperienceCapabilityInput): ExperienceQuality {
  if (input.reducedMotion || !input.webglAvailable || input.softwareRenderer)
    return 'fallback'

  const constrainedCpu = input.hardwareConcurrency !== undefined && input.hardwareConcurrency <= 4
  const smallScreen = input.viewportWidth < 900
  const denseSmallScreen = smallScreen && input.devicePixelRatio > 2

  return constrainedCpu || smallScreen || denseSmallScreen ? 'balanced' : 'high'
}

export function shouldRunExperienceIntro(input: ExperienceIntroInput) {
  if (input.reducedMotion)
    return false
  if (input.force)
    return true
  return !input.hasSeenIntro && input.hash.length === 0
}

export function resolveExperiencePresentation(input: ExperiencePresentationInput): ExperiencePresentation {
  if (input.failed || input.quality === 'fallback')
    return 'static'
  return input.ready ? 'cinematic' : 'loading'
}

export function parseSoundPreference(value: string | null) {
  return value === 'true'
}

export function interpolateExperienceStage(stages: ExperienceStage[], viewportCenter: number) {
  if (stages.length === 0)
    return { cameraX: 0, chapter: 'hero' as ExperienceChapter, progress: 0 }

  if (viewportCenter <= stages[0]!.center)
    return { cameraX: stages[0]!.cameraX, chapter: stages[0]!.chapter, progress: 0 }

  const last = stages.at(-1)!
  if (viewportCenter >= last.center)
    return { cameraX: last.cameraX, chapter: last.chapter, progress: 1 }

  for (let index = 0; index < stages.length - 1; index += 1) {
    const current = stages[index]!
    const next = stages[index + 1]!

    if (viewportCenter <= next.center) {
      const localProgress = (viewportCenter - current.center) / (next.center - current.center)
      const eased = localProgress * localProgress * (3 - 2 * localProgress)
      const cameraX = current.cameraX + (next.cameraX - current.cameraX) * eased
      const chapter = localProgress < 0.5 ? current.chapter : next.chapter
      const progress = (index + localProgress) / (stages.length - 1)

      return { cameraX, chapter, progress }
    }
  }

  return { cameraX: last.cameraX, chapter: last.chapter, progress: 1 }
}

function smootherStep(value: number) {
  const clamped = Math.min(1, Math.max(0, value))
  return clamped * clamped * clamped * (clamped * (clamped * 6 - 15) + 10)
}

export function evaluateCameraKeyframes(keyframes: CameraKeyframe[], progress: number) {
  if (keyframes.length === 0)
    throw new Error('At least one camera keyframe is required')
  const clampedProgress = Math.min(1, Math.max(0, progress))
  const first = keyframes[0]!
  const last = keyframes.at(-1)!
  if (clampedProgress <= first.progress)
    return { ...first, roll: first.roll ?? 0 }
  if (clampedProgress >= last.progress)
    return { ...last, roll: last.roll ?? 0 }

  const nextIndex = keyframes.findIndex(keyframe => keyframe.progress >= clampedProgress)
  const next = keyframes[nextIndex]!
  const previous = keyframes[nextIndex - 1]!
  const localProgress = smootherStep((clampedProgress - previous.progress) / (next.progress - previous.progress))
  const interpolateTuple = (start: [number, number, number], end: [number, number, number]) => start.map((value, index) => value + (end[index]! - value) * localProgress) as [number, number, number]

  return {
    progress: clampedProgress,
    position: interpolateTuple(previous.position, next.position),
    target: interpolateTuple(previous.target, next.target),
    fov: previous.fov + (next.fov - previous.fov) * localProgress,
    roll: (previous.roll ?? 0) + ((next.roll ?? 0) - (previous.roll ?? 0)) * localProgress,
  }
}

export function validateAssetManifest(manifest: SceneAssetManifest) {
  return Boolean(
    manifest.coreUrl.endsWith('.glb')
    && manifest.detailUrl.endsWith('.glb')
    && manifest.coreByteBudget > 0
    && manifest.detailByteBudget > 0
    && manifest.requiredCoreNodes.length > 0
    && manifest.requiredDetailNodes.length > 0,
  )
}

export function evaluateEvidenceGraphPhase(definition: EvidenceGraphDefinition, progress: number): EvidenceGraphState {
  if (!definition.phases.length)
    throw new Error(`${definition.id} must define at least one phase`)
  const clamped = Math.min(1, Math.max(0, progress))
  const phaseIndex = definition.phases.findIndex(phase => clamped <= phase.end)
  const resolvedIndex = phaseIndex === -1 ? definition.phases.length - 1 : phaseIndex
  return {
    progress: clamped,
    phaseIndex: resolvedIndex,
    phase: definition.phases[resolvedIndex]!,
  }
}

export function graphLocalProgress(globalProgress: number, start: number, end: number) {
  if (end <= start)
    return 0
  return Math.min(1, Math.max(0, (globalProgress - start) / (end - start)))
}

export function isEvidenceEdgeActive(definition: EvidenceGraphDefinition, edge: EvidenceEdge, progress: number) {
  const phase = definition.phases.find(item => item.id === edge.activationPhase)
  return phase ? Math.min(1, Math.max(0, progress)) >= phase.start : false
}

export function validateEvidenceGraph(definition: EvidenceGraphDefinition) {
  const errors: string[] = []
  const nodeIds = new Set<string>()
  const phaseIds = new Set(definition.phases.map(phase => phase.id))

  for (const node of definition.nodes) {
    if (nodeIds.has(node.id))
      errors.push(`Duplicate node id: ${node.id}`)
    nodeIds.add(node.id)
    if (!node.label.trim())
      errors.push(`Node ${node.id} has no semantic label`)
    if (!node.metadataRef.trim())
      errors.push(`Node ${node.id} has no project metadata reference`)
    if (!phaseIds.has(node.activationPhase))
      errors.push(`Node ${node.id} activates in unknown phase ${node.activationPhase}`)
  }

  for (const edge of definition.edges) {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target))
      errors.push(`Edge ${edge.id} is dangling`)
    if (!phaseIds.has(edge.activationPhase))
      errors.push(`Edge ${edge.id} activates in unknown phase ${edge.activationPhase}`)
  }

  definition.phases.forEach((phase, index) => {
    if (!phase.annotation.trim())
      errors.push(`Phase ${phase.id} has no annotation`)
    if (phase.start < 0 || phase.end > 1 || phase.start >= phase.end)
      errors.push(`Phase ${phase.id} has an invalid range`)
    const previous = definition.phases[index - 1]
    if (previous && phase.start < previous.end)
      errors.push(`Phase ${phase.id} overlaps ${previous.id}`)
  })

  if (definition.phases[0]?.start !== 0 || definition.phases.at(-1)?.end !== 1)
    errors.push('Phases must cover progress 0 through 1')
  return errors
}
