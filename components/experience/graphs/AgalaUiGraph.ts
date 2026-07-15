import * as THREE from 'three'
import type { EvidenceGraphDefinition, ExperienceQuality } from '~/types/experience'
import { EvidenceGraph } from './EvidenceGraph'

export function createAgalaUiGraph(definition: EvidenceGraphDefinition, quality: Exclude<ExperienceQuality, 'fallback'>) {
  return new EvidenceGraph(definition, {
    geometry: new THREE.BoxGeometry(1, 1, 1),
    nodeColor: 0x7c332f,
    activeColor: 0xd7b169,
    edgeColor: 0xb99155,
    pulseColor: 0xffd88a,
    metalness: 0.12,
    roughness: 0.72,
    rootScale: 0.88,
    decorate(root) {
      const parchment = new THREE.MeshStandardMaterial({ color: 0xc4aa7d, roughness: 0.9, metalness: 0.02 })
      const blueprint = new THREE.Mesh(new THREE.BoxGeometry(4.7, 0.035, 3), parchment)
      blueprint.name = 'UIBlueprint'
      blueprint.position.set(0, -0.08, 0.08)
      root.add(blueprint)

      const railMaterial = new THREE.LineBasicMaterial({ color: 0x5c352c, transparent: true, opacity: 0.55 })
      const railPoints: THREE.Vector3[] = []
      for (let index = -2; index <= 2; index += 1) {
        railPoints.push(new THREE.Vector3(index * 0.78, -0.045, -1.25), new THREE.Vector3(index * 0.78, -0.045, 1.4))
        railPoints.push(new THREE.Vector3(-2.2, -0.045, index * 0.52), new THREE.Vector3(2.2, -0.045, index * 0.52))
      }
      root.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(railPoints), railMaterial))
      const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3, 20), new THREE.MeshStandardMaterial({ color: 0x6b2a27, roughness: 0.68 }))
      roll.rotation.x = Math.PI / 2
      roll.position.set(-2.28, 0.05, 0.08)
      root.add(roll)
    },
  }, quality)
}
