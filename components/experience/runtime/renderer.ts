import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import type { ExperienceQuality } from '~/types/experience'

export class EstateRenderer {
  readonly renderer: THREE.WebGLRenderer
  readonly scene: THREE.Scene
  readonly camera: THREE.PerspectiveCamera
  private composer?: EffectComposer

  constructor(canvas: HTMLCanvasElement, quality: Exclude<ExperienceQuality, 'fallback'>) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: quality === 'high',
      powerPreference: 'high-performance',
    })
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    // Keep counters across composer passes so the development HUD reports the
    // estate workload instead of only the final fullscreen output pass.
    this.renderer.info.autoReset = false
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = quality === 'high' ? 0.98 : 1.08
    this.renderer.shadowMap.enabled = quality === 'high'
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x070504)
    this.scene.fog = new THREE.FogExp2(0x080504, quality === 'high' ? 0.028 : 0.022)
    this.camera = new THREE.PerspectiveCamera(quality === 'high' ? 38 : 45, 1, 0.1, 130)

    if (quality === 'high') {
      this.composer = new EffectComposer(this.renderer)
      this.composer.addPass(new RenderPass(this.scene, this.camera))
      this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.32, 0.38, 0.86))
      this.composer.addPass(new OutputPass())
    }
  }

  resize(width: number, height: number, quality: Exclude<ExperienceQuality, 'fallback'>) {
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'high' ? 1.5 : 1))
    this.renderer.setSize(width, height, false)
    this.composer?.setSize(width, height)
  }

  render() {
    this.renderer.info.reset()
    if (this.composer)
      this.composer.render()
    else
      this.renderer.render(this.scene, this.camera)
  }

  setAnimationLoop(callback: XRFrameRequestCallback | null) {
    this.renderer.setAnimationLoop(callback)
  }

  stats() {
    return {
      calls: this.renderer.info.render.calls,
      triangles: this.renderer.info.render.triangles,
    }
  }

  dispose() {
    this.setAnimationLoop(null)
    this.composer?.dispose()
    this.renderer.dispose()
  }
}
