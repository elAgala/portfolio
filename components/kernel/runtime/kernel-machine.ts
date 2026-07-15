import * as THREE from 'three'
import type { KernelQuality } from '~/types/workbench'

interface KernelLayer {
  group: THREE.Group
  assembledY: number
  inspectedY: number
}

export interface KernelMachineRuntime {
  resize: (width: number, height: number) => void
  setExploded: (exploded: boolean) => void
  setPointer: (x: number, y: number) => void
  render: (elapsed: number) => void
  dispose: () => void
}

const palette = {
  brass: 0xa57b3e,
  brassBright: 0xd0a455,
  oxblood: 0x6b1f28,
  phosphor: 0x9bbf72,
  ink: 0x111713,
  panel: 0x18201a,
  steel: 0x38413a,
}

function box(width: number, height: number, depth: number, material: THREE.Material) {
  return new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material)
}

function createTrace(points: Array<[number, number, number]>, material: THREE.LineBasicMaterial) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points.map(point => new THREE.Vector3(...point)))
  return new THREE.Line(geometry, material)
}

function addFrame(group: THREE.Group, width: number, depth: number, y: number, material: THREE.Material) {
  const thickness = 0.045
  const railDepth = 0.055
  const rails = [
    box(width, thickness, railDepth, material),
    box(width, thickness, railDepth, material),
    box(railDepth, thickness, depth, material),
    box(railDepth, thickness, depth, material),
  ]
  rails[0]!.position.set(0, y, -depth / 2)
  rails[1]!.position.set(0, y, depth / 2)
  rails[2]!.position.set(-width / 2, y, 0)
  rails[3]!.position.set(width / 2, y, 0)
  group.add(...rails)
}

function createLayer(
  label: string,
  dimensions: [number, number],
  assembledY: number,
  inspectedY: number,
  materials: Record<string, THREE.Material>,
  quality: KernelQuality,
): KernelLayer {
  const [width, depth] = dimensions
  const group = new THREE.Group()
  group.name = `kernel-${label}`
  group.position.y = assembledY

  const board = box(width, 0.13, depth, materials.panel!)
  board.receiveShadow = true
  board.castShadow = true
  group.add(board)
  addFrame(group, width + 0.18, depth + 0.18, 0.11, materials.brass!)
  addFrame(group, width - 0.34, depth - 0.34, 0.12, materials.steel!)

  const phosphorLine = materials.phosphorLine as THREE.LineBasicMaterial
  const brassLine = materials.brassLine as THREE.LineBasicMaterial
  const traceY = 0.155
  group.add(
    createTrace([[-width * 0.38, traceY, -depth * 0.3], [-width * 0.12, traceY, -depth * 0.3], [-width * 0.12, traceY, depth * 0.18], [width * 0.28, traceY, depth * 0.18]], phosphorLine),
    createTrace([[-width * 0.28, traceY, depth * 0.32], [width * 0.06, traceY, depth * 0.32], [width * 0.06, traceY, -depth * 0.12], [width * 0.38, traceY, -depth * 0.12]], brassLine),
  )

  if (label === 'interface') {
    const screen = box(width * 0.56, 0.08, depth * 0.42, materials.oxblood!)
    screen.position.set(-0.28, 0.2, 0.08)
    screen.castShadow = true
    group.add(screen)

    const dial = new THREE.Mesh(new THREE.TorusGeometry(0.37, 0.07, 12, quality === 'high' ? 40 : 24), materials.brassBright!)
    dial.rotation.x = Math.PI / 2
    dial.position.set(width * 0.3, 0.27, -depth * 0.2)
    dial.castShadow = true
    group.add(dial)

    for (let index = 0; index < 4; index += 1) {
      const key = box(0.3, 0.09, 0.18, index === 0 ? materials.phosphor! : materials.steel!)
      key.position.set(width * 0.19 + index * 0.38, 0.2, depth * 0.28)
      group.add(key)
    }
  }

  if (label === 'services') {
    const serviceCount = quality === 'high' ? 10 : 7
    for (let index = 0; index < serviceCount; index += 1) {
      const column = index % 5
      const row = Math.floor(index / 5)
      const service = box(0.53, 0.23 + (index % 3) * 0.05, 0.48, index === 4 ? materials.oxblood! : materials.steel!)
      service.position.set(-1.28 + column * 0.64, 0.23, -0.42 + row * 0.84)
      service.castShadow = true
      group.add(service)

      const status = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), index === 4 ? materials.brassBright! : materials.phosphor!)
      status.position.set(service.position.x + 0.17, 0.39, service.position.z + 0.16)
      group.add(status)
    }
  }

  if (label === 'platform') {
    const heatSink = box(width * 0.5, 0.28, depth * 0.46, materials.oxblood!)
    heatSink.position.set(0, 0.25, 0)
    heatSink.castShadow = true
    group.add(heatSink)

    for (let index = 0; index < 7; index += 1) {
      const fin = box(0.07, 0.22, depth * 0.38, materials.brass!)
      fin.position.set(-0.88 + index * 0.29, 0.48, 0)
      fin.castShadow = true
      group.add(fin)
    }

    for (const x of [-1.75, 1.75]) {
      for (const z of [-0.86, 0.86]) {
        const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.28, 16), materials.steel!)
        mount.position.set(x, 0.21, z)
        mount.castShadow = true
        group.add(mount)
      }
    }
  }

  return { group, assembledY, inspectedY }
}

export function createKernelMachine(canvas: HTMLCanvasElement, quality: Exclude<KernelQuality, 'fallback'>): KernelMachineRuntime {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'high' ? 1.5 : 1))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = quality === 'high'
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x0b0f0d, 0.058)
  const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 50)
  camera.position.set(6.2, 4.25, 7.1)
  camera.lookAt(0, 0.1, 0)

  const materials: Record<string, THREE.Material> = {
    panel: new THREE.MeshStandardMaterial({ color: palette.panel, roughness: 0.58, metalness: 0.58 }),
    brass: new THREE.MeshStandardMaterial({ color: palette.brass, roughness: 0.4, metalness: 0.9 }),
    brassBright: new THREE.MeshStandardMaterial({ color: palette.brassBright, roughness: 0.32, metalness: 0.82, emissive: 0x32230d, emissiveIntensity: 0.5 }),
    oxblood: new THREE.MeshStandardMaterial({ color: palette.oxblood, roughness: 0.43, metalness: 0.55, emissive: 0x26080c, emissiveIntensity: 0.8 }),
    phosphor: new THREE.MeshStandardMaterial({ color: palette.phosphor, roughness: 0.38, emissive: 0x263c17, emissiveIntensity: 1.4 }),
    steel: new THREE.MeshStandardMaterial({ color: palette.steel, roughness: 0.52, metalness: 0.72 }),
    phosphorLine: new THREE.LineBasicMaterial({ color: palette.phosphor, transparent: true, opacity: 0.8 }),
    brassLine: new THREE.LineBasicMaterial({ color: palette.brassBright, transparent: true, opacity: 0.72 }),
  }

  const machine = new THREE.Group()
  machine.rotation.set(-0.06, -0.48, -0.03)
  scene.add(machine)

  const layers = [
    createLayer('platform', [5.1, 3.05], -0.84, -1.45, materials, quality),
    createLayer('services', [4.6, 2.72], 0, 0, materials, quality),
    createLayer('interface', [4.85, 2.9], 0.84, 1.52, materials, quality),
  ]
  machine.add(...layers.map(layer => layer.group))

  const spineMaterial = materials.brassBright!
  const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 3.65, 16), spineMaterial)
  spine.position.set(-2.02, 0.05, 1.13)
  machine.add(spine)
  const secondSpine = spine.clone()
  secondSpine.position.x = 2.02
  secondSpine.position.z = -1.13
  machine.add(secondSpine)

  const coreMaterial = materials.oxblood as THREE.MeshStandardMaterial
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.34, quality === 'high' ? 2 : 1), coreMaterial)
  core.position.set(0.98, 0.15, -0.48)
  core.castShadow = true
  machine.add(core)
  const coreRing = new THREE.Mesh(new THREE.TorusGeometry(0.51, 0.028, 10, 48), materials.brassBright!)
  coreRing.rotation.x = Math.PI / 2
  coreRing.position.copy(core.position)
  machine.add(coreRing)

  if (quality === 'high') {
    const particleCount = 95
    const particlePositions = new Float32Array(particleCount * 3)
    for (let index = 0; index < particleCount; index += 1) {
      particlePositions[index * 3] = (Math.random() - 0.5) * 8
      particlePositions[index * 3 + 1] = (Math.random() - 0.5) * 5
      particlePositions[index * 3 + 2] = (Math.random() - 0.5) * 6
    }
    const particles = new THREE.Points(
      new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(particlePositions, 3)),
      new THREE.PointsMaterial({ color: palette.brass, size: 0.018, transparent: true, opacity: 0.42 }),
    )
    scene.add(particles)
  }

  scene.add(new THREE.HemisphereLight(0xd9cfb7, 0x111612, 1.55))
  const keyLight = new THREE.DirectionalLight(0xffdfae, 3.3)
  keyLight.position.set(4, 7, 5)
  keyLight.castShadow = quality === 'high'
  keyLight.shadow.mapSize.set(1024, 1024)
  scene.add(keyLight)
  const redLight = new THREE.PointLight(0x8a2630, 8, 9, 2)
  redLight.position.set(-3, 0.8, 2.8)
  scene.add(redLight)
  const greenLight = new THREE.PointLight(0x8bb663, 4, 8, 2)
  greenLight.position.set(2.8, -0.4, -2.5)
  scene.add(greenLight)

  let explosionTarget = 0
  let explosion = 0
  let pointerX = 0
  let pointerY = 0
  let rotationX = machine.rotation.x
  let rotationY = machine.rotation.y

  return {
    resize(width, height) {
      const safeWidth = Math.max(width, 1)
      const safeHeight = Math.max(height, 1)
      renderer.setSize(safeWidth, safeHeight, false)
      camera.aspect = safeWidth / safeHeight
      camera.updateProjectionMatrix()
    },
    setExploded(exploded) {
      explosionTarget = exploded ? 1 : 0
    },
    setPointer(x, y) {
      pointerX = x
      pointerY = y
    },
    render(elapsed) {
      explosion = THREE.MathUtils.lerp(explosion, explosionTarget, 0.075)
      layers.forEach((layer) => {
        layer.group.position.y = THREE.MathUtils.lerp(layer.assembledY, layer.inspectedY, explosion)
      })

      const targetY = -0.48 + pointerX * 0.24 + Math.sin(elapsed * 0.18) * 0.025
      const targetX = -0.06 + pointerY * 0.12
      rotationY = THREE.MathUtils.lerp(rotationY, targetY, 0.055)
      rotationX = THREE.MathUtils.lerp(rotationX, targetX, 0.055)
      machine.rotation.y = rotationY
      machine.rotation.x = rotationX
      machine.position.y = Math.sin(elapsed * 0.7) * 0.035
      core.rotation.y = elapsed * 0.82
      core.rotation.x = elapsed * 0.42
      coreRing.rotation.z = elapsed * 0.35
      coreMaterial.emissiveIntensity = 0.72 + Math.sin(elapsed * 2.1) * 0.2
      renderer.render(scene, camera)
    },
    dispose() {
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
          object.geometry.dispose()
          const objectMaterials = Array.isArray(object.material) ? object.material : [object.material]
          objectMaterials.forEach(material => material.dispose())
        }
      })
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
