import type { CameraKeyframe, ExperienceChapterConfig, SceneAssetManifest } from '~/types/experience'

export const introCamera = {
  position: [0, 2.6, 20] as [number, number, number],
  target: [0, 2.55, 8.7] as [number, number, number],
  fov: 38,
}

export const experienceChapters: ExperienceChapterConfig[] = [
  {
    id: 'hero',
    label: 'The study',
    start: 0,
    end: 0.16,
    room: 'study',
    htmlAlign: 'left',
    cameraKeys: [
      { progress: 0, position: [0.4, 2.85, 7.2], target: [0, 1.15, -0.5], fov: 38 },
      { progress: 0.16, position: [4.2, 3.4, 4.6], target: [7.9, 1.55, -4], fov: 41 },
    ],
  },
  {
    id: 'agala-ui',
    label: 'The first evidence',
    start: 0.16,
    end: 0.33,
    room: 'council',
    htmlAlign: 'right',
    graphId: 'agala-ui',
    cameraKeys: [
      { progress: 0.16, position: [5.6, 3.8, 3.4], target: [8.2, 1.55, -4], fov: 39 },
      { progress: 0.33, position: [9.2, 4.1, 3.1], target: [12, 1.55, -4], fov: 40 },
    ],
  },
  {
    id: 'agala-deploy',
    label: 'The operation',
    start: 0.33,
    end: 0.5,
    room: 'council',
    htmlAlign: 'right',
    graphId: 'agala-deploy',
    cameraKeys: [
      { progress: 0.33, position: [9.2, 4.1, 3.1], target: [12, 1.55, -4], fov: 40 },
      { progress: 0.5, position: [12.6, 3.85, 3.2], target: [15.8, 1.55, -4], fov: 39 },
    ],
  },
  {
    id: 'agala-ai',
    label: 'The intelligence',
    start: 0.5,
    end: 0.66,
    room: 'council',
    htmlAlign: 'right',
    graphId: 'agala-ai',
    cameraKeys: [
      { progress: 0.5, position: [12.6, 3.85, 3.2], target: [15.8, 1.55, -4], fov: 39 },
      { progress: 0.66, position: [19.4, 3.5, 3.7], target: [23.2, 1.4, -3], fov: 42 },
    ],
  },
  {
    id: 'profile',
    label: 'The archive',
    start: 0.66,
    end: 0.88,
    room: 'archive',
    htmlAlign: 'right',
    cameraKeys: [
      { progress: 0.66, position: [19.4, 3.5, 3.7], target: [23.2, 1.4, -3], fov: 42 },
      { progress: 0.78, position: [22.1, 3.3, 3.8], target: [23.7, 1.2, -3.2], fov: 40 },
      { progress: 0.88, position: [27.8, 3.4, 8.8], target: [31.8, 2.1, 3.1], fov: 42 },
    ],
  },
  {
    id: 'contact',
    label: 'The decision',
    start: 0.88,
    end: 1,
    room: 'decision',
    htmlAlign: 'left',
    cameraKeys: [
      { progress: 0.88, position: [27.8, 3.4, 8.8], target: [31.8, 2.1, 3.1], fov: 42 },
      { progress: 1, position: [32, 3.1, 14.2], target: [32, 2.15, 3], fov: 38 },
    ],
  },
]

export const cameraKeyframes: CameraKeyframe[] = experienceChapters
  .flatMap(chapter => chapter.cameraKeys)
  .filter((keyframe, index, items) => index === 0 || keyframe.progress !== items[index - 1]?.progress)
  .sort((left, right) => left.progress - right.progress)

const requiredCoreNodes = [
  'Threshold', 'Study', 'CouncilTable', 'ThresholdDoorLeft', 'ThresholdDoorRight',
  'AnchorAgalaUI', 'AnchorAgalaDeploy', 'AnchorAgalaAI',
]
const requiredDetailNodes = ['Archive', 'Decision', 'ArchiveDrawerFeature', 'DecisionDoorLeft', 'DecisionDoorRight']

export const estateAssets: Record<'high' | 'balanced', SceneAssetManifest> = {
  high: {
    quality: 'high',
    coreUrl: '/models/estate-core-high.glb',
    detailUrl: '/models/estate-detail-high.glb',
    coreByteBudget: 2_200_000,
    detailByteBudget: 1_100_000,
    requiredCoreNodes,
    requiredDetailNodes,
  },
  balanced: {
    quality: 'balanced',
    coreUrl: '/models/estate-core-balanced.glb',
    detailUrl: '/models/estate-detail-balanced.glb',
    coreByteBudget: 900_000,
    detailByteBudget: 500_000,
    requiredCoreNodes,
    requiredDetailNodes,
  },
}
