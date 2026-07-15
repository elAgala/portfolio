import * as THREE from 'three'
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { evidenceGraphById } from '~/data/experience-graphs'
import type { EvidenceGraphId, EvidenceGraphRuntime, EvidenceGraphRuntimeStats, ExperienceQuality } from '~/types/experience'
import { createEvidenceGraph } from '../graphs'
import { disposeObject3D } from './disposal'

interface ZoneLight {
  light: THREE.SpotLight
  center: number
}

export class EstateWorld {
  private core?: THREE.Object3D
  private detail?: THREE.Object3D
  private thresholdLeft?: THREE.Object3D
  private thresholdRight?: THREE.Object3D
  private threshold?: THREE.Object3D
  private study?: THREE.Object3D
  private council?: THREE.Object3D
  private archive?: THREE.Object3D
  private decision?: THREE.Object3D
  private archiveDrawer?: THREE.Object3D
  private decisionLeft?: THREE.Object3D
  private decisionRight?: THREE.Object3D
  private graphs = new Map<EvidenceGraphId, EvidenceGraphRuntime>()
  private lights: THREE.Light[] = []
  private zoneLights: ZoneLight[] = []
  private dust?: THREE.Points
  private materials: THREE.Material[] = []
  private geometries: THREE.BufferGeometry[] = []

  constructor(
    private scene: THREE.Scene,
    private quality: Exclude<ExperienceQuality, 'fallback'>,
  ) {
    this.addLighting()
    this.addDust()
  }

  private addLighting() {
    const hemisphere = new THREE.HemisphereLight(0x6d4934, 0x090504, this.quality === 'high' ? 1.05 : 1.45)
    this.scene.add(hemisphere)
    this.lights.push(hemisphere)

    const thresholdLight = new THREE.SpotLight(0xffbd72, 0, 24, Math.PI / 3.8, 0.72, 1.25)
    thresholdLight.position.set(0, 7.5, 15)
    thresholdLight.target.position.set(0, 2.6, 9)
    thresholdLight.castShadow = this.quality === 'high'
    if (thresholdLight.castShadow)
      thresholdLight.shadow.mapSize.set(1024, 1024)
    this.scene.add(thresholdLight, thresholdLight.target)
    this.lights.push(thresholdLight)
    this.zoneLights.push({ light: thresholdLight, center: 0 })

    const zones = [
      { position: new THREE.Vector3(0, 8, 3), target: new THREE.Vector3(0, 1, -1), center: 0.05, color: 0xffc681 },
      { position: new THREE.Vector3(12, 9, 2), target: new THREE.Vector3(12, 1, -4), center: 0.4, color: 0xffcf8c },
      { position: new THREE.Vector3(24, 8, 3), target: new THREE.Vector3(24, 1, -3), center: 0.72, color: 0xe8b26e },
      { position: new THREE.Vector3(32, 8, 10), target: new THREE.Vector3(32, 2, 3), center: 0.96, color: 0xe5966d },
    ]
    zones.forEach((zone, index) => {
      const light = new THREE.SpotLight(zone.color, 0, 28, Math.PI / 4.4, 0.72, 1.35)
      light.position.copy(zone.position)
      light.target.position.copy(zone.target)
      light.castShadow = this.quality === 'high' && index < 2
      if (light.castShadow)
        light.shadow.mapSize.set(1024, 1024)
      this.scene.add(light, light.target)
      this.lights.push(light)
      this.zoneLights.push({ light, center: zone.center })
    })

    const dawn = new THREE.DirectionalLight(0x934839, 2.5)
    dawn.position.set(32, 5, 0)
    this.scene.add(dawn)
    this.lights.push(dawn)
  }

  private addDust() {
    const count = this.quality === 'high' ? 850 : 240
    const positions = new Float32Array(count * 3)
    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = Math.random() * 42 - 5
      positions[index * 3 + 1] = Math.random() * 7
      positions[index * 3 + 2] = Math.random() * 25 - 9
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const material = new THREE.PointsMaterial({
      color: 0xd2ad72,
      size: this.quality === 'high' ? 0.024 : 0.038,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    this.geometries.push(geometry)
    this.materials.push(material)
    this.dust = new THREE.Points(geometry, material)
    this.dust.name = 'EstateDust'
    this.scene.add(this.dust)
  }

  private addEvidenceGraphs(root: THREE.Object3D) {
    const anchors: Array<[EvidenceGraphId, string]> = [
      ['agala-ui', 'AnchorAgalaUI'],
      ['agala-deploy', 'AnchorAgalaDeploy'],
      ['agala-ai', 'AnchorAgalaAI'],
    ]
    anchors.forEach(([id, anchorName]) => {
      const anchor = root.getObjectByName(anchorName)
      if (!anchor)
        throw new Error(`Estate graph anchor not found: ${anchorName}`)
      const graph = createEvidenceGraph(evidenceGraphById[id], this.quality)
      anchor.add(graph.root)
      this.graphs.set(id, graph)
    })
  }

  attachCore(gltf: GLTF) {
    this.core = gltf.scene
    this.scene.add(this.core)
    this.threshold = this.core.getObjectByName('Threshold')
    this.study = this.core.getObjectByName('Study')
    this.council = this.core.getObjectByName('CouncilTable')
    this.thresholdLeft = this.core.getObjectByName('ThresholdDoorLeft')
    this.thresholdRight = this.core.getObjectByName('ThresholdDoorRight')
    this.addEvidenceGraphs(this.core)
  }

  attachDetail(gltf: GLTF) {
    this.detail = gltf.scene
    this.scene.add(this.detail)
    this.archive = this.detail.getObjectByName('Archive')
    this.decision = this.detail.getObjectByName('Decision')
    this.archiveDrawer = this.detail.getObjectByName('ArchiveDrawerFeature')
    this.decisionLeft = this.detail.getObjectByName('DecisionDoorLeft')
    this.decisionRight = this.detail.getObjectByName('DecisionDoorRight')
  }

  update(
    progress: number,
    elapsed: number,
    introProgress: number,
    activeGraphId: EvidenceGraphId | null = null,
    graphProgress: Record<EvidenceGraphId, number> = { 'agala-ui': 0, 'agala-deploy': 0, 'agala-ai': 0 },
  ) {
    // Keep the current room and its immediate transition neighbor active. The
    // generous overlap avoids visible pop-in while still culling distant wings.
    if (this.threshold)
      this.threshold.visible = progress < 0.24
    if (this.study)
      this.study.visible = progress < 0.38
    if (this.council)
      this.council.visible = progress > 0.08 && progress < 0.76
    if (this.archive)
      this.archive.visible = progress > 0.56 && progress < 0.95
    if (this.decision)
      this.decision.visible = progress > 0.78

    const doorReveal = THREE.MathUtils.smootherstep(introProgress, 0.18, 0.95)
    if (this.thresholdLeft)
      this.thresholdLeft.rotation.y = -doorReveal * 1.14
    if (this.thresholdRight)
      this.thresholdRight.rotation.y = doorReveal * 1.14

    const archiveReveal = THREE.MathUtils.smootherstep(progress, 0.62, 0.76)
    if (this.archiveDrawer)
      this.archiveDrawer.position.z = -1.6 + archiveReveal * 1.4

    const decisionReveal = THREE.MathUtils.smootherstep(progress, 0.88, 1)
    if (this.decisionLeft)
      this.decisionLeft.rotation.y = -decisionReveal * 1.08
    if (this.decisionRight)
      this.decisionRight.rotation.y = decisionReveal * 1.08

    this.zoneLights.forEach(({ light, center }) => {
      const proximity = Math.max(0.13, 1 - Math.abs(progress - center) / 0.36)
      light.intensity = (this.quality === 'high' ? 45 : 29) * proximity
    })

    this.graphs.forEach((graph, id) => {
      const active = id === activeGraphId
      graph.setActive(active)
      if (active) {
        graph.setProgress(graphProgress[id])
        graph.update(elapsed)
      }
    })

    if (this.dust) {
      this.dust.position.y = Math.sin(elapsed * 0.09) * 0.12
      this.dust.rotation.y = elapsed * 0.004
    }
  }

  graphStats(): EvidenceGraphRuntimeStats | undefined {
    return [...this.graphs.values()].map(graph => graph.stats()).find(stats => stats.active)
  }

  dispose() {
    this.graphs.forEach(graph => graph.dispose())
    this.graphs.clear()
    if (this.core)
      disposeObject3D(this.core)
    if (this.detail)
      disposeObject3D(this.detail)
    this.dust?.removeFromParent()
    this.geometries.forEach(geometry => geometry.dispose())
    this.materials.forEach(material => material.dispose())
    this.lights.forEach(light => {
      light.removeFromParent()
      if (light instanceof THREE.SpotLight) {
        light.target.removeFromParent()
        light.dispose()
      }
    })
  }
}
