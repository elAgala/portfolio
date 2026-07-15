export type ExperienceChapter = 'hero' | 'agala-ui' | 'agala-deploy' | 'agala-ai' | 'profile' | 'contact'
export type ExperienceQuality = 'high' | 'balanced' | 'fallback'
export type ExperienceRoom = 'study' | 'council' | 'archive' | 'decision'
export type ExperienceLoadPhase = 'idle' | 'core' | 'detail' | 'ready' | 'fallback'
export type Vec3Tuple = [number, number, number]
export type EvidenceGraphId = 'agala-ui' | 'agala-deploy' | 'agala-ai'
export type EvidenceNodeKind = 'token' | 'primitive' | 'workflow' | 'input' | 'secret' | 'inventory' | 'runtime' | 'target' | 'role' | 'contract' | 'outcome'
export type EvidenceEdgeStyle = 'flow' | 'contract' | 'assembly'
export type EvidenceMaterialTheme = 'parchment-oxblood' | 'steel-brass' | 'glass-brass'

export interface CameraKeyframe {
  progress: number
  position: Vec3Tuple
  target: Vec3Tuple
  fov: number
  roll?: number
}

export interface ExperienceChapterConfig {
  id: ExperienceChapter
  label: string
  start: number
  end: number
  room: ExperienceRoom
  htmlAlign: 'left' | 'right' | 'center'
  cameraKeys: CameraKeyframe[]
  graphId?: 'agala-ui' | 'agala-deploy' | 'agala-ai'
}

export interface SceneAssetManifest {
  quality: Exclude<ExperienceQuality, 'fallback'>
  coreUrl: string
  detailUrl: string
  coreByteBudget: number
  detailByteBudget: number
  requiredCoreNodes: string[]
  requiredDetailNodes: string[]
}

export interface ExperienceRuntimeState {
  quality: ExperienceQuality
  loadPhase: ExperienceLoadPhase
  loadProgress: number
  activeChapter: ExperienceChapter
  progress: number
  soundEnabled: boolean
  failureReason?: string
}

export interface ExperienceStage {
  chapter: ExperienceChapter
  center: number
  cameraX: number
}

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

export interface EvidenceGraphState {
  progress: number
  phaseIndex: number
  phase: EvidencePhase
}

export interface EvidenceGraphRuntimeStats {
  id: EvidenceGraphId
  active: boolean
  activeInstances: number
  triangles: number
  updateMs: number
  updates: number
}

export interface EvidenceGraphRuntime {
  readonly id: EvidenceGraphId
  readonly root: import('three').Group
  setProgress: (progress: number) => void
  setQuality: (quality: Exclude<ExperienceQuality, 'fallback'>) => void
  setActive: (active: boolean) => void
  update: (elapsed: number) => void
  stats: () => EvidenceGraphRuntimeStats
  dispose: () => void
}
