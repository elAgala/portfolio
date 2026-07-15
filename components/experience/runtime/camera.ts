import * as THREE from 'three'
import { cameraKeyframes, introCamera } from '~/data/experience'
import type { ExperienceQuality } from '~/types/experience'
import { evaluateCameraKeyframes } from '~/utils/experience'

export class CinematicCameraRig {
  private position = new THREE.Vector3(...introCamera.position)
  private target = new THREE.Vector3(...introCamera.target)
  private desiredPosition = this.position.clone()
  private desiredTarget = this.target.clone()
  private desiredFov = introCamera.fov

  constructor(
    private camera: THREE.PerspectiveCamera,
    private quality: Exclude<ExperienceQuality, 'fallback'>,
  ) {
    this.camera.position.copy(this.position)
    this.camera.fov = introCamera.fov
    this.camera.lookAt(this.target)
  }

  update(progress: number, introProgress: number, pointer: THREE.Vector2, delta: number) {
    const state = evaluateCameraKeyframes(cameraKeyframes, progress)
    const scrollPosition = new THREE.Vector3(...state.position)
    const scrollTarget = new THREE.Vector3(...state.target)
    const reveal = THREE.MathUtils.smootherstep(introProgress, 0, 1)

    this.desiredPosition.set(...introCamera.position).lerp(scrollPosition, reveal)
    this.desiredTarget.set(...introCamera.target).lerp(scrollTarget, reveal)
    this.desiredFov = THREE.MathUtils.lerp(introCamera.fov, state.fov, reveal)

    if (this.quality === 'high') {
      this.desiredPosition.x += pointer.x * 0.28
      this.desiredPosition.y += pointer.y * 0.16
    }

    const damping = 1 - Math.exp(-5.2 * Math.min(delta, 0.25))
    this.position.lerp(this.desiredPosition, damping)
    this.target.lerp(this.desiredTarget, damping)
    this.camera.position.copy(this.position)
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, this.desiredFov, damping)
    this.camera.updateProjectionMatrix()
    this.camera.lookAt(this.target)
    this.camera.rotation.z = THREE.MathUtils.lerp(this.camera.rotation.z, state.roll ?? 0, damping)
  }
}
