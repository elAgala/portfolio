export type HeroSceneQuality = 'high' | 'balanced' | 'fallback'

export interface HeroSceneQualityInput {
  reducedMotion: boolean
  webglAvailable: boolean
  viewportWidth: number
  devicePixelRatio: number
  hardwareConcurrency?: number
}
