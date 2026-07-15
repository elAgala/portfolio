import type { GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'
import type { SceneAssetManifest } from '~/types/experience'

export interface EstateLoadHooks {
  onProgress: (progress: number) => void
  onCore: (gltf: GLTF) => void
  onDetail: (gltf: GLTF) => void
}

function validateNodes(gltf: GLTF, requiredNodes: string[]) {
  const names = new Set<string>()
  gltf.scene.traverse((object) => {
    if (object.name)
      names.add(object.name)
  })
  const missing = requiredNodes.filter(node => !names.has(node))
  if (missing.length)
    throw new Error(`Estate asset is missing required nodes: ${missing.join(', ')}`)
}

export async function loadEstateAssets(manifest: SceneAssetManifest, hooks: EstateLoadHooks) {
  await MeshoptDecoder.ready
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
  hooks.onProgress(0.08)
  const core = await loader.loadAsync(manifest.coreUrl, event => {
    if (event.total > 0)
      hooks.onProgress(Math.min(0.68, (event.loaded / event.total) * 0.68))
  })
  validateNodes(core, manifest.requiredCoreNodes)
  hooks.onCore(core)
  hooks.onProgress(0.7)

  const detailPromise = loader.loadAsync(manifest.detailUrl, event => {
    if (event.total > 0)
      hooks.onProgress(0.7 + Math.min(0.29, (event.loaded / event.total) * 0.29))
  }).then((detail) => {
    validateNodes(detail, manifest.requiredDetailNodes)
    hooks.onDetail(detail)
    hooks.onProgress(1)
    return detail
  })

  return { core, detailPromise }
}
