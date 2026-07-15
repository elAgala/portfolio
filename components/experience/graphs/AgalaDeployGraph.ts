import * as THREE from 'three'
import type { EvidenceGraphDefinition, ExperienceQuality } from '~/types/experience'
import { EvidenceGraph } from './EvidenceGraph'

export function createAgalaDeployGraph(definition: EvidenceGraphDefinition, quality: Exclude<ExperienceQuality, 'fallback'>) {
  return new EvidenceGraph(definition, {
    geometry: new THREE.BoxGeometry(0.72, 0.72, 0.72),
    nodeColor: 0x202629,
    activeColor: 0xd4a95c,
    edgeColor: 0xb99155,
    pulseColor: 0xf6c469,
    metalness: 0.82,
    roughness: 0.28,
    rootScale: 0.82,
    decorate(root, tier) {
      const steel = new THREE.MeshStandardMaterial({ color: 0x171b1d, metalness: 0.88, roughness: 0.24 })
      const brass = new THREE.MeshStandardMaterial({ color: 0x9c7438, metalness: 0.9, roughness: 0.22, emissive: 0x241305, emissiveIntensity: 0.35 })
      const rail = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.06, 2.5), steel)
      rail.name = 'DeployTopologyDeck'
      rail.position.y = -0.12
      root.add(rail)
      const vault = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.54, 0.22, tier === 'high' ? 40 : 20), brass)
      vault.name = 'DeployVault'
      vault.position.set(-1.05, 0.43, -0.15)
      root.add(vault)
      const serverGeometry = new THREE.BoxGeometry(0.28, 1.2, 0.36)
      const servers = new THREE.InstancedMesh(serverGeometry, steel, 3)
      for (let index = 0; index < 3; index += 1) {
        const serverMatrix = new THREE.Matrix4().makeTranslation(1.75 + index * 0.3, 0.5, 0.78 - index * 0.42)
        servers.setMatrixAt(index, serverMatrix)
      }
      servers.instanceMatrix.needsUpdate = true
      servers.name = 'DeployTargets'
      root.add(servers)
    },
  }, quality)
}
