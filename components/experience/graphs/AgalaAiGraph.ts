import * as THREE from 'three'
import type { EvidenceGraphDefinition, ExperienceQuality } from '~/types/experience'
import { EvidenceGraph } from './EvidenceGraph'

export function createAgalaAiGraph(definition: EvidenceGraphDefinition, quality: Exclude<ExperienceQuality, 'fallback'>) {
  return new EvidenceGraph(definition, {
    geometry: new THREE.IcosahedronGeometry(0.42, quality === 'high' ? 2 : 1),
    nodeColor: 0x17131a,
    activeColor: 0xd2aa62,
    edgeColor: 0xb99155,
    pulseColor: 0xffd37d,
    metalness: 0.7,
    roughness: 0.18,
    rootScale: 0.9,
    decorate(root, tier) {
      const glass = new THREE.MeshPhysicalMaterial({ color: 0x100d13, metalness: 0.42, roughness: 0.13, transmission: tier === 'high' ? 0.2 : 0, transparent: true, opacity: 0.88 })
      const brass = new THREE.MeshStandardMaterial({ color: 0xa57a3d, metalness: 0.9, roughness: 0.18, emissive: 0x271604, emissiveIntensity: 0.35 })
      const council = new THREE.Mesh(new THREE.CylinderGeometry(2.25, 2.25, 0.09, tier === 'high' ? 64 : 32), glass)
      council.name = 'AICouncilGlass'
      council.position.y = -0.09
      root.add(council)
      for (const radius of [1.3, 1.92]) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.026, 8, tier === 'high' ? 64 : 32), brass)
        ring.name = 'AIContractRing'
        ring.rotation.x = Math.PI / 2
        ring.position.y = 0.08
        root.add(ring)
      }
      const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, tier === 'high' ? 1 : 0), glass)
      core.name = 'AICompletionCore'
      core.position.set(0, 0.84, 0.1)
      root.add(core)
    },
  }, quality)
}
