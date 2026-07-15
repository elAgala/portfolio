import * as THREE from 'three'
import type { EvidenceGraphDefinition, EvidenceGraphRuntime, EvidenceGraphRuntimeStats, ExperienceQuality } from '~/types/experience'
import { evaluateEvidenceGraphPhase } from '~/utils/experience'
import { disposeObject3D } from '../runtime/disposal'

export interface EvidenceGraphVisualStyle {
  geometry: THREE.BufferGeometry
  nodeColor: THREE.ColorRepresentation
  activeColor: THREE.ColorRepresentation
  edgeColor: THREE.ColorRepresentation
  pulseColor: THREE.ColorRepresentation
  metalness: number
  roughness: number
  rootScale?: number
  decorate: (root: THREE.Group, quality: Exclude<ExperienceQuality, 'fallback'>) => void
}

const hiddenMatrix = new THREE.Matrix4().makeScale(0, 0, 0)
const matrix = new THREE.Matrix4()
const position = new THREE.Vector3()
const targetPosition = new THREE.Vector3()
const scale = new THREE.Vector3()
const quaternion = new THREE.Quaternion()
const color = new THREE.Color()

function revealAt(progress: number, start: number, duration = 0.16) {
  return THREE.MathUtils.smootherstep(progress, start, Math.min(1, start + duration))
}

export class EvidenceGraph implements EvidenceGraphRuntime {
  readonly id
  readonly root = new THREE.Group()
  private quality: Exclude<ExperienceQuality, 'fallback'>
  private nodeMesh: THREE.InstancedMesh
  private edgeLines: THREE.LineSegments
  private pulses: THREE.InstancedMesh
  private active = true
  private lastProgress = -1
  private currentProgress = 0
  private activeInstances = 0
  private triangleCount = 0
  private updateDuration = 0
  private updateCount = 0
  private inactiveColor: THREE.Color
  private activeColor: THREE.Color
  private edgeColor: THREE.Color
  private nodeById: Map<string, EvidenceGraphDefinition['nodes'][number]>
  private phaseIndex: Map<string, number>

  constructor(
    private definition: EvidenceGraphDefinition,
    style: EvidenceGraphVisualStyle,
    quality: Exclude<ExperienceQuality, 'fallback'>,
  ) {
    this.id = definition.id
    this.quality = quality
    this.nodeById = new Map(definition.nodes.map(node => [node.id, node]))
    this.phaseIndex = new Map(definition.phases.map((phase, index) => [phase.id, index]))
    this.inactiveColor = new THREE.Color(style.nodeColor)
    this.activeColor = new THREE.Color(style.activeColor)
    this.edgeColor = new THREE.Color(style.edgeColor)
    this.root.name = `${definition.id}-evidence-graph`
    this.root.scale.setScalar(style.rootScale ?? 1)
    this.root.position.y = 0.36

    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: style.metalness,
      roughness: style.roughness,
      emissive: style.activeColor,
      emissiveIntensity: 0.14,
    })
    this.nodeMesh = new THREE.InstancedMesh(style.geometry, nodeMaterial, definition.nodes.length)
    this.nodeMesh.name = `${definition.id}-nodes`
    this.nodeMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.nodeMesh.frustumCulled = false
    this.root.add(this.nodeMesh)

    const edgePositions = new Float32Array(definition.edges.length * 6)
    const edgeColors = new Float32Array(definition.edges.length * 6)
    definition.edges.forEach((edge, index) => {
      const source = this.nodeById.get(edge.source)!
      const target = this.nodeById.get(edge.target)!
      edgePositions.set([...source.position, ...target.position], index * 6)
    })
    const edgeGeometry = new THREE.BufferGeometry()
    edgeGeometry.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3))
    edgeGeometry.setAttribute('color', new THREE.BufferAttribute(edgeColors, 3))
    const edgeMaterial = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.82 })
    this.edgeLines = new THREE.LineSegments(edgeGeometry, edgeMaterial)
    this.edgeLines.name = `${definition.id}-edges`
    this.edgeLines.frustumCulled = false
    this.root.add(this.edgeLines)

    const pulseGeometry = new THREE.SphereGeometry(0.055, quality === 'high' ? 12 : 7, quality === 'high' ? 8 : 5)
    const pulseMaterial = new THREE.MeshBasicMaterial({ color: style.pulseColor, toneMapped: false })
    this.pulses = new THREE.InstancedMesh(pulseGeometry, pulseMaterial, definition.edges.length)
    this.pulses.name = `${definition.id}-pulses`
    this.pulses.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.pulses.frustumCulled = false
    this.root.add(this.pulses)

    style.decorate(this.root, quality)
    this.root.traverse((object) => {
      if (!(object instanceof THREE.Mesh))
        return
      const triangles = object.geometry.index
        ? object.geometry.index.count / 3
        : object.geometry.getAttribute('position')?.count / 3 || 0
      this.triangleCount += triangles * (object instanceof THREE.InstancedMesh ? object.count : 1)
    })
    this.setProgress(quality === 'balanced' ? 1 : 0)
    this.setActive(false)
  }

  setQuality(quality: Exclude<ExperienceQuality, 'fallback'>) {
    if (this.quality === quality)
      return
    this.quality = quality
    this.lastProgress = -1
    this.pulses.visible = quality === 'high' && this.active
    this.setProgress(this.currentProgress)
  }

  setActive(active: boolean) {
    if (this.active === active)
      return
    this.active = active
    this.root.visible = active
    this.pulses.visible = active && this.quality === 'high' && this.currentProgress < 0.985
    if (active)
      this.lastProgress = -1
  }

  setProgress(progressValue: number) {
    if (!this.active && this.lastProgress >= 0)
      return
    const started = performance.now()
    this.currentProgress = Math.min(1, Math.max(0, progressValue))
    const effectiveProgress = this.quality === 'balanced' ? 1 : this.currentProgress
    if (Math.abs(effectiveProgress - this.lastProgress) < 0.0005)
      return
    this.lastProgress = effectiveProgress
    this.activeInstances = 0

    this.definition.nodes.forEach((node, index) => {
      const activationIndex = this.phaseIndex.get(node.activationPhase) ?? 0
      const phaseStart = this.definition.phases[activationIndex]!.start
      const reveal = revealAt(effectiveProgress, phaseStart)
      if (reveal > 0.02)
        this.activeInstances += 1
      position.set(...node.position)
      scale.set(...(node.scale ?? [0.48, 0.48, 0.48])).multiplyScalar(reveal)
      matrix.compose(position, quaternion, scale)
      this.nodeMesh.setMatrixAt(index, reveal > 0.001 ? matrix : hiddenMatrix)
      const emphasis = evaluateEvidenceGraphPhase(this.definition, effectiveProgress).phase.activeNodeGroups.includes(node.group)
      color.copy(emphasis ? this.activeColor : this.inactiveColor)
      color.multiplyScalar(emphasis ? 1.5 : 0.58)
      this.nodeMesh.setColorAt(index, color)
    })
    this.nodeMesh.instanceMatrix.needsUpdate = true
    if (this.nodeMesh.instanceColor)
      this.nodeMesh.instanceColor.needsUpdate = true

    const colors = this.edgeLines.geometry.getAttribute('color') as THREE.BufferAttribute
    this.definition.edges.forEach((edge, index) => {
      const activationIndex = this.phaseIndex.get(edge.activationPhase) ?? 0
      const reveal = revealAt(effectiveProgress, this.definition.phases[activationIndex]!.start, 0.12)
      color.copy(this.edgeColor)
      color.multiplyScalar(0.12 + reveal * 1.35)
      colors.setXYZ(index * 2, color.r, color.g, color.b)
      colors.setXYZ(index * 2 + 1, color.r, color.g, color.b)
    })
    colors.needsUpdate = true
    this.pulses.visible = this.active && this.quality === 'high' && effectiveProgress < 0.985
    this.updateDuration = performance.now() - started
    this.updateCount += 1
  }

  update(elapsed: number) {
    if (!this.active || this.quality !== 'high' || this.currentProgress >= 0.985)
      return
    const started = performance.now()
    this.definition.edges.forEach((edge, index) => {
      const phaseIndex = this.phaseIndex.get(edge.activationPhase) ?? 0
      const active = this.currentProgress >= this.definition.phases[phaseIndex]!.start
      if (!active) {
        this.pulses.setMatrixAt(index, hiddenMatrix)
        return
      }
      const source = this.nodeById.get(edge.source)!
      const target = this.nodeById.get(edge.target)!
      const travel = (elapsed / edge.pulseDuration + index * 0.17) % 1
      targetPosition.set(...target.position)
      position.set(...source.position).lerp(targetPosition, travel)
      scale.setScalar(0.75 + Math.sin(travel * Math.PI) * 0.45)
      matrix.compose(position, quaternion, scale)
      this.pulses.setMatrixAt(index, matrix)
    })
    this.pulses.instanceMatrix.needsUpdate = true
    this.updateDuration = performance.now() - started
    this.updateCount += 1
  }

  stats(): EvidenceGraphRuntimeStats {
    return {
      id: this.id,
      active: this.active,
      activeInstances: this.activeInstances,
      triangles: this.triangleCount,
      updateMs: this.updateDuration,
      updates: this.updateCount,
    }
  }

  dispose() {
    disposeObject3D(this.root)
  }
}
