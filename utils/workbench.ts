import type { EvidenceGraphDefinition, HeroSceneQuality, HeroSceneQualityInput, TracePhase } from '~/types/workbench'

export function chooseHeroSceneQuality(input: HeroSceneQualityInput): HeroSceneQuality {
  if (input.reducedMotion || !input.webglAvailable)
    return 'fallback'

  const constrainedViewport = input.viewportWidth < 760
  const constrainedPixelDensity = input.devicePixelRatio > 2
  const constrainedCpu = input.hardwareConcurrency !== undefined && input.hardwareConcurrency < 6

  return constrainedViewport || constrainedPixelDensity || constrainedCpu ? 'balanced' : 'high'
}

export function clampHeroPointer(value: number): number {
  return Math.min(1, Math.max(-1, value))
}

export function getTracePhase(progress: number | null): TracePhase {
  if (progress === null)
    return 'idle'
  const normalized = Math.min(1, Math.max(0, progress))
  if (normalized < 2 / 11)
    return 'source'
  if (normalized < 5 / 11)
    return 'services'
  if (normalized < 8.5 / 11)
    return 'linux'
  return 'complete'
}

export function validateEvidenceGraph(definition: EvidenceGraphDefinition): string[] {
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
