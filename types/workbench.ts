export type Vec3Tuple = [number, number, number]
export type EvidenceGraphId = 'agala-ui' | 'agala-deploy' | 'agala-ai'
export type EvidenceNodeKind = 'token' | 'primitive' | 'workflow' | 'input' | 'secret' | 'inventory' | 'runtime' | 'target' | 'role' | 'contract' | 'outcome'
export type EvidenceEdgeStyle = 'flow' | 'contract' | 'assembly'
export type EvidenceMaterialTheme = 'parchment-oxblood' | 'steel-brass' | 'glass-brass'
export type KernelQuality = 'high' | 'balanced' | 'fallback'

export interface EvidenceNode {
  id: string
  label: string
  kind: EvidenceNodeKind
  group: string
  position: Vec3Tuple
  scale?: Vec3Tuple
  activationPhase: string
  metadataRef: string
}

export interface EvidenceEdge {
  id: string
  source: string
  target: string
  direction: 'forward' | 'bidirectional'
  style: EvidenceEdgeStyle
  activationPhase: string
  pulseDuration: number
}

export interface EvidencePhase {
  id: string
  label: string
  start: number
  end: number
  annotation: string
  activeNodeGroups: string[]
  activeEdgeGroups: string[]
  cameraEmphasis: Vec3Tuple
}

export interface EvidenceGraphDefinition {
  id: EvidenceGraphId
  title: string
  outcome: string
  nodes: EvidenceNode[]
  edges: EvidenceEdge[]
  phases: EvidencePhase[]
  materialTheme: EvidenceMaterialTheme
  staticCameraFrame: {
    position: Vec3Tuple
    target: Vec3Tuple
  }
}

export interface KernelQualityInput {
  reducedMotion: boolean
  webglAvailable: boolean
  viewportWidth: number
  devicePixelRatio: number
  hardwareConcurrency?: number
}
