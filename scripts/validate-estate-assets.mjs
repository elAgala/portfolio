import { readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'

const definitions = [
  {
    file: 'estate-core-high.glb',
    budget: 2_200_000,
    triangles: 250_000,
    nodes: ['Threshold', 'Study', 'CouncilTable', 'ThresholdDoorLeft', 'ThresholdDoorRight', 'AnchorAgalaUI', 'AnchorAgalaDeploy', 'AnchorAgalaAI'],
  },
  {
    file: 'estate-core-balanced.glb',
    budget: 900_000,
    triangles: 80_000,
    nodes: ['Threshold', 'Study', 'CouncilTable', 'ThresholdDoorLeft', 'ThresholdDoorRight', 'AnchorAgalaUI', 'AnchorAgalaDeploy', 'AnchorAgalaAI'],
  },
  {
    file: 'estate-detail-high.glb',
    budget: 1_100_000,
    triangles: 150_000,
    nodes: ['Archive', 'Decision', 'ArchiveDrawerFeature', 'DecisionDoorLeft', 'DecisionDoorRight'],
  },
  {
    file: 'estate-detail-balanced.glb',
    budget: 500_000,
    triangles: 50_000,
    nodes: ['Archive', 'Decision', 'ArchiveDrawerFeature', 'DecisionDoorLeft', 'DecisionDoorRight'],
  },
]

await MeshoptDecoder.ready
const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
const reports = []

for (const definition of definitions) {
  const path = resolve('public/models', definition.file)
  const bytes = statSync(path).size
  const buffer = readFileSync(path)
  const gltf = await loader.parseAsync(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength), '')
  const names = new Set()
  let triangles = 0
  gltf.scene.traverse((object) => {
    if (object.name)
      names.add(object.name)
    if (object.isMesh) {
      const geometry = object.geometry
      triangles += geometry.index ? geometry.index.count / 3 : geometry.attributes.position.count / 3
    }
  })
  const missingNodes = definition.nodes.filter(name => !names.has(name))
  if (bytes > definition.budget)
    throw new Error(`${definition.file} is ${bytes} bytes, above its ${definition.budget} byte budget`)
  if (triangles > definition.triangles)
    throw new Error(`${definition.file} has ${triangles} triangles, above its ${definition.triangles} budget`)
  if (missingNodes.length)
    throw new Error(`${definition.file} is missing nodes: ${missingNodes.join(', ')}`)
  reports.push({ file: definition.file, bytes, triangles, requiredNodes: definition.nodes.length })
}

console.table(reports)
