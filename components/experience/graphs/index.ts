import type { EvidenceGraphDefinition, EvidenceGraphRuntime, ExperienceQuality } from '~/types/experience'
import { createAgalaAiGraph } from './AgalaAiGraph'
import { createAgalaDeployGraph } from './AgalaDeployGraph'
import { createAgalaUiGraph } from './AgalaUiGraph'

export function createEvidenceGraph(definition: EvidenceGraphDefinition, quality: Exclude<ExperienceQuality, 'fallback'>): EvidenceGraphRuntime {
  if (definition.id === 'agala-ui')
    return createAgalaUiGraph(definition, quality)
  if (definition.id === 'agala-deploy')
    return createAgalaDeployGraph(definition, quality)
  return createAgalaAiGraph(definition, quality)
}
