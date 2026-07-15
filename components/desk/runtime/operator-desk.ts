import * as THREE from 'three'
import type { HeroSceneQuality, OperatorTerminalFrame, OperatorTerminalMode, TerminalLineKind } from '~/types/workbench'

export interface OperatorDeskRuntime {
  resize: (width: number, height: number) => void
  setPointer: (x: number, y: number) => void
  setMode: (mode: OperatorTerminalMode) => void
  setTransitionProgress: (progress: number) => void
  setTerminalFrame: (frame: OperatorTerminalFrame) => void
  hitTestTerminalControl: (x: number, y: number) => boolean
  render: (elapsed: number) => void
  dispose: () => void
}

const palette = {
  brass: 0xa57b3e,
  brassBright: 0xd8a750,
  oxblood: 0x6b1f28,
  phosphor: 0x9bbf72,
  phosphorBright: 0xc3ea91,
  ink: 0x070a08,
  steel: 0x29312b,
  steelRaised: 0x3c463e,
  walnut: 0x342017,
  paper: 0xddd0b8,
}

function box(width: number, height: number, depth: number, material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

function createWoodTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const context = canvas.getContext('2d')!
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, '#24150f')
  gradient.addColorStop(0.5, '#4a2b1d')
  gradient.addColorStop(1, '#281811')
  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.globalAlpha = 0.2
  for (let index = 0; index < 44; index += 1) {
    const y = 5 + index * 5.8
    context.strokeStyle = index % 3 === 0 ? '#c07a45' : '#0d0705'
    context.lineWidth = index % 4 === 0 ? 2 : 1
    context.beginPath()
    context.moveTo(0, y)
    for (let x = 0; x <= canvas.width; x += 24)
      context.lineTo(x, y + Math.sin(x * 0.035 + index * 0.8) * 4)
    context.stroke()
  }
  context.globalAlpha = 1
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2.2, 1)
  texture.anisotropy = 4
  return texture
}

function createTextTexture(
  lines: string[],
  options: { width?: number, height?: number, background?: string, color?: string, accent?: string, fontSize?: number } = {},
) {
  const canvas = document.createElement('canvas')
  canvas.width = options.width ?? 1024
  canvas.height = options.height ?? 576
  const context = canvas.getContext('2d')!
  context.fillStyle = options.background ?? '#07100a'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.strokeStyle = '#26352a'
  context.lineWidth = 3
  context.strokeRect(12, 12, canvas.width - 24, canvas.height - 24)

  const fontSize = options.fontSize ?? 38
  context.font = `600 ${fontSize}px "JetBrains Mono", monospace`
  context.textBaseline = 'top'
  lines.forEach((line, index) => {
    context.fillStyle = line.startsWith('$') || line.startsWith('>')
      ? options.accent ?? '#a8d17b'
      : options.color ?? '#ded7ca'
    context.fillText(line, 44, 42 + index * (fontSize * 1.65))
  })

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return { texture, canvas, context }
}

function wrapTerminalLine(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (!text)
    return ['']
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (current && context.measureText(candidate).width > maxWidth) {
      lines.push(current)
      current = word
    }
    else {
      current = candidate
    }
  }
  lines.push(current)
  return lines
}

function terminalColor(kind: TerminalLineKind) {
  if (kind === 'command')
    return '#f0e8d8'
  if (kind === 'system')
    return '#d7a957'
  if (kind === 'error')
    return '#e38a82'
  return '#9da99e'
}

function updateMonitorTexture(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, frame: OperatorTerminalFrame) {
  const scale = canvas.width / 1536
  const compactTexture = canvas.width < 1400
  const inset = 32 * scale
  const headerHeight = 78 * scale
  const fontSize = compactTexture ? 43 : 27 * scale
  const lineHeight = compactTexture ? 61 : 43 * scale
  const left = 58 * scale
  const contentTop = inset + headerHeight + 34 * scale
  const contentBottom = canvas.height - 54 * scale
  const contentWidth = canvas.width - left * 2

  context.fillStyle = '#050907'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#0d1510'
  context.fillRect(inset, inset, canvas.width - inset * 2, headerHeight)
  context.strokeStyle = '#304034'
  context.lineWidth = 2 * scale
  context.strokeRect(inset, inset, canvas.width - inset * 2, canvas.height - inset * 2)
  context.beginPath()
  context.moveTo(inset, inset + headerHeight)
  context.lineTo(canvas.width - inset, inset + headerHeight)
  context.stroke()

  for (let index = 0; index < 3; index += 1) {
    context.beginPath()
    context.fillStyle = ['#657064', '#a57b3e', '#6b1f28'][index]!
    context.arc(left + index * 24 * scale, inset + headerHeight / 2, 6 * scale, 0, Math.PI * 2)
    context.fill()
  }

  context.textBaseline = 'middle'
  context.font = `600 ${compactTexture ? 26 : 19 * scale}px "JetBrains Mono", monospace`
  context.fillStyle = '#869187'
  context.fillText('julian@workbench: ~/portfolio', 154 * scale, inset + headerHeight / 2)
  context.textAlign = 'right'
  context.fillStyle = '#9bbf72'
  context.fillText('[ ESC / LEAVE ]', canvas.width - left, inset + headerHeight / 2)
  context.textAlign = 'left'
  context.textBaseline = 'top'
  context.font = `500 ${fontSize}px "JetBrains Mono", monospace`

  const rendered = frame.lines.flatMap(line => wrapTerminalLine(context, line.text, contentWidth).map(text => ({ text, kind: line.kind })))
  const promptRows = frame.booting ? 0 : 1
  const maxRows = Math.max(3, Math.floor((contentBottom - contentTop) / lineHeight) - promptRows)
  const visible = rendered.slice(-maxRows)
  visible.forEach((line, index) => {
    context.fillStyle = terminalColor(line.kind)
    const prefix = line.kind === 'command' ? '$ ' : ''
    context.fillText(`${prefix}${line.text}`, left, contentTop + index * lineHeight)
  })

  if (!frame.booting) {
    const promptY = contentTop + visible.length * lineHeight + 8 * scale
    context.fillStyle = '#9bbf72'
    context.fillText(frame.prompt, left, promptY)
    const promptWidth = context.measureText(frame.prompt).width
    context.fillStyle = '#f1eadc'
    context.fillText(frame.input, left + promptWidth, promptY)
    if (frame.cursorVisible) {
      const inputWidth = context.measureText(frame.input).width
      context.fillStyle = '#9bbf72'
      context.fillRect(left + promptWidth + inputWidth + 3 * scale, promptY + 2 * scale, 14 * scale, fontSize + 3 * scale)
    }
  }
}

function labelPlane(text: string, width: number, height: number, color = '#d9a95c') {
  const { texture } = createTextTexture([text], {
    width: 512,
    height: 128,
    background: '#0b0f0d',
    color,
    accent: color,
    fontSize: 42,
  })
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material)
  mesh.userData.disposableTexture = texture
  return mesh
}

function createCable(points: THREE.Vector3[], material: THREE.MeshStandardMaterial) {
  const curve = new THREE.CatmullRomCurve3(points)
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.025, 8, false), material)
  mesh.receiveShadow = true
  return { curve, mesh }
}

function createServiceBay(materials: Record<string, THREE.Material>) {
  const group = new THREE.Group()
  group.name = 'service-bay'
  const base = box(2.15, 0.18, 1.35, materials.ink!)
  group.add(base)
  const rim = box(2.2, 0.04, 1.4, materials.brass!)
  rim.position.y = 0.08
  group.add(rim)
  const labels = ['GO', 'C#', 'NODE']
  labels.forEach((label, index) => {
    const card = box(0.54, 0.4, 0.85, index === 0 ? materials.oxblood! : materials.steelRaised!)
    card.position.set(-0.68 + index * 0.68, 0.25, 0)
    group.add(card)
    const status = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), materials.statusOff!)
    status.position.set(card.position.x + 0.16, 0.49, 0.3)
    status.userData.serviceStatus = true
    group.add(status)
    const labelMesh = labelPlane(label, 0.42, 0.13, '#e4d9c8')
    labelMesh.rotation.x = -Math.PI / 2
    labelMesh.position.set(card.position.x, 0.46, -0.02)
    group.add(labelMesh)
  })
  const title = labelPlane('SERVICE BAY', 1.35, 0.2, '#d9a95c')
  title.rotation.x = -Math.PI / 2
  title.position.set(0, 0.12, 0.73)
  group.add(title)
  const serviceGlow = new THREE.PointLight(0x8fba65, 1.6, 3.2, 2)
  serviceGlow.position.set(0, 1.15, 0.25)
  group.add(serviceGlow)
  return group
}

function createLinuxHost(materials: Record<string, THREE.Material>) {
  const group = new THREE.Group()
  group.name = 'linux-host'
  const tower = box(1.45, 2.65, 1.25, materials.ink!)
  group.add(tower)
  const face = box(1.24, 2.42, 0.06, materials.steel!)
  face.position.z = 0.655
  group.add(face)
  for (let row = 0; row < 5; row += 1) {
    const vent = box(0.78, 0.045, 0.04, materials.steelRaised!)
    vent.position.set(0, 0.6 - row * 0.28, 0.7)
    group.add(vent)
  }
  const label = labelPlane('LINUX HOST', 1.05, 0.22, '#c8e99d')
  label.position.set(0, 0.98, 0.7)
  group.add(label)
  for (let index = 0; index < 3; index += 1) {
    const light = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 8), materials.statusOff!)
    light.position.set(-0.25 + index * 0.25, -0.95, 0.71)
    light.userData.hostStatus = true
    group.add(light)
  }
  return group
}

export function createOperatorDesk(canvas: HTMLCanvasElement, quality: Exclude<HeroSceneQuality, 'fallback'>): OperatorDeskRuntime {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: true,
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'high' ? 1.5 : 1))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = quality === 'high'
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x070a08, 0.045)
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60)
  const baseCamera = new THREE.Vector3(7.25, 5.15, 8.1)
  const baseTarget = new THREE.Vector3(0, -0.35, 0)
  camera.position.copy(baseCamera)
  camera.lookAt(baseTarget)

  const woodTexture = createWoodTexture()
  const statusOff = new THREE.MeshStandardMaterial({ color: 0x314034, roughness: 0.4, emissive: 0x08110a, emissiveIntensity: 0.3 })
  const statusOn = new THREE.MeshStandardMaterial({ color: palette.phosphorBright, roughness: 0.25, emissive: 0x4d7e2f, emissiveIntensity: 2.8 })
  const cableIdle = new THREE.MeshStandardMaterial({ color: 0x5b4527, roughness: 0.5, metalness: 0.72, emissive: 0x1a1005, emissiveIntensity: 0.2 })
  const materials: Record<string, THREE.Material> = {
    walnut: new THREE.MeshStandardMaterial({ color: palette.walnut, map: woodTexture, roughness: 0.68, metalness: 0.08 }),
    brass: new THREE.MeshStandardMaterial({ color: palette.brass, roughness: 0.33, metalness: 0.92 }),
    brassBright: new THREE.MeshStandardMaterial({ color: palette.brassBright, roughness: 0.28, metalness: 0.86, emissive: 0x3b2107, emissiveIntensity: 0.8 }),
    oxblood: new THREE.MeshStandardMaterial({ color: palette.oxblood, roughness: 0.52, metalness: 0.2, emissive: 0x210508, emissiveIntensity: 0.55 }),
    ink: new THREE.MeshStandardMaterial({ color: palette.ink, roughness: 0.48, metalness: 0.72 }),
    steel: new THREE.MeshStandardMaterial({ color: palette.steel, roughness: 0.54, metalness: 0.7 }),
    steelRaised: new THREE.MeshStandardMaterial({ color: palette.steelRaised, roughness: 0.45, metalness: 0.75 }),
    paper: new THREE.MeshStandardMaterial({ color: palette.paper, roughness: 0.86 }),
    statusOff,
    statusOn,
  }

  const desk = new THREE.Group()
  desk.name = 'operator-desk'
  desk.rotation.y = -0.04
  scene.add(desk)

  const desktop = box(7.5, 0.32, 4.35, materials.walnut!)
  desktop.position.y = -1.52
  desk.add(desktop)
  const frontTrim = box(7.54, 0.06, 0.08, materials.brass!)
  frontTrim.position.set(0, -1.34, 2.14)
  desk.add(frontTrim)
  for (const x of [-3.15, 3.15]) {
    const leg = box(0.34, 1.75, 0.5, materials.walnut!)
    leg.position.set(x, -2.48, 1.42)
    desk.add(leg)
  }

  const monitor = new THREE.Group()
  monitor.position.set(-0.7, -0.08, -0.52)
  desk.add(monitor)
  const monitorBody = box(3.35, 2.28, 0.72, materials.ink!)
  monitor.add(monitorBody)
  const monitorBezel = box(3.05, 1.92, 0.09, materials.steel!)
  monitorBezel.position.z = 0.405
  monitor.add(monitorBezel)
  const monitorTexture = createTextTexture([], {
    width: quality === 'high' ? 1536 : 1152,
    height: quality === 'high' ? 872 : 654,
  })
  updateMonitorTexture(monitorTexture.canvas, monitorTexture.context, {
    lines: [
      { id: 1, kind: 'system', text: 'OPERATOR WORKBENCH / TTY READY' },
      { id: 2, kind: 'output', text: 'Enter terminal to inspect the portfolio.' },
    ],
    input: '',
    prompt: 'julian@workbench:~$ ',
    cursorVisible: true,
    booting: false,
  })
  monitorTexture.texture.needsUpdate = true
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.78, 1.58),
    new THREE.MeshBasicMaterial({ map: monitorTexture.texture, color: 0xffffff }),
  )
  screen.position.z = 0.456
  monitor.add(screen)
  const stand = box(0.55, 0.55, 0.5, materials.steel!)
  stand.position.y = -1.36
  monitor.add(stand)
  const foot = box(1.55, 0.12, 0.88, materials.ink!)
  foot.position.set(0, -1.63, 0.1)
  monitor.add(foot)

  const keyboard = new THREE.Group()
  keyboard.position.set(-0.72, -1.19, 1.04)
  keyboard.rotation.x = -0.1
  desk.add(keyboard)
  const keyboardBase = box(3.15, 0.16, 1.05, materials.ink!)
  keyboard.add(keyboardBase)
  const keyRows = quality === 'high' ? 4 : 3
  for (let row = 0; row < keyRows; row += 1) {
    for (let column = 0; column < 11; column += 1) {
      const key = box(0.19, 0.07, 0.16, column === 1 && row === 0 ? materials.oxblood! : materials.steelRaised!)
      key.position.set(-1.22 + column * 0.245, 0.12, -0.32 + row * 0.21)
      keyboard.add(key)
    }
  }

  const folio = box(1.45, 0.11, 1.8, materials.oxblood!)
  folio.position.set(-2.82, -1.28, 0.55)
  folio.rotation.y = -0.13
  desk.add(folio)
  const folioLine = box(0.04, 0.04, 1.55, materials.brass!)
  folioLine.position.set(-2.42, -1.2, 0.45)
  folioLine.rotation.y = -0.13
  desk.add(folioLine)

  const serviceBay = createServiceBay(materials)
  serviceBay.position.set(1.72, -1.15, 0.75)
  serviceBay.rotation.y = -0.05
  desk.add(serviceBay)

  const linuxHost = createLinuxHost(materials)
  linuxHost.position.set(2.65, -0.12, -0.95)
  linuxHost.rotation.y = -0.12
  desk.add(linuxHost)

  const nameplate = labelPlane('J. BENITEZ / ENGINEERING', 2.05, 0.34, '#e4d4b8')
  nameplate.rotation.x = -Math.PI / 2
  nameplate.position.set(0.1, -1.31, 1.88)
  desk.add(nameplate)

  const lamp = new THREE.Group()
  lamp.position.set(-3.05, -1.15, -0.92)
  desk.add(lamp)
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.65, 0.16, 28), materials.brass!)
  lamp.add(lampBase)
  const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.075, 2.75, 16), materials.brass!)
  lampStem.position.set(0, 1.35, 0)
  lampStem.rotation.z = -0.06
  lamp.add(lampStem)
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.78, 0.62, 32, 1, true), materials.brass!)
  shade.position.set(0.35, 2.72, 0.18)
  shade.rotation.z = -0.72
  shade.rotation.x = 0.1
  lamp.add(shade)
  const lampGlow = new THREE.PointLight(0xffc77d, quality === 'high' ? 12 : 7, 8, 2)
  lampGlow.position.set(0.7, 2.3, 0.65)
  lamp.add(lampGlow)

  const sourceCable = createCable([
    new THREE.Vector3(0.15, -1.26, 0.38),
    new THREE.Vector3(0.55, -1.22, 0.62),
    new THREE.Vector3(0.95, -1.18, 0.76),
    new THREE.Vector3(1.3, -1.08, 0.76),
  ], cableIdle)
  desk.add(sourceCable.mesh)
  const hostCable = createCable([
    new THREE.Vector3(2.35, -1.04, 0.7),
    new THREE.Vector3(2.7, -0.98, 0.35),
    new THREE.Vector3(2.85, -0.75, -0.1),
    new THREE.Vector3(2.72, -0.55, -0.36),
  ], cableIdle)
  desk.add(hostCable.mesh)

  const pulseMaterial = new THREE.MeshStandardMaterial({ color: palette.phosphorBright, emissive: 0x527f36, emissiveIntensity: 4, roughness: 0.2 })
  const sourcePulse = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), pulseMaterial)
  const hostPulse = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), pulseMaterial)
  sourcePulse.visible = false
  hostPulse.visible = false
  desk.add(sourcePulse, hostPulse)

  if (quality === 'high') {
    const particleCount = 75
    const positions = new Float32Array(particleCount * 3)
    for (let index = 0; index < particleCount; index += 1) {
      positions[index * 3] = Math.sin(index * 12.9898) * 7
      positions[index * 3 + 1] = 0.3 + (index % 13) * 0.31
      positions[index * 3 + 2] = Math.cos(index * 7.233) * 4
    }
    scene.add(new THREE.Points(
      new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(positions, 3)),
      new THREE.PointsMaterial({ color: palette.brass, size: 0.018, transparent: true, opacity: 0.32 }),
    ))
  }

  scene.add(new THREE.HemisphereLight(0xcfc6af, 0x090d0a, quality === 'high' ? 1.25 : 1.5))
  const keyLight = new THREE.DirectionalLight(0xffd6a0, quality === 'high' ? 3.6 : 2.6)
  keyLight.position.set(3.5, 7.5, 5.5)
  keyLight.castShadow = quality === 'high'
  keyLight.shadow.mapSize.set(1024, 1024)
  scene.add(keyLight)
  const oxbloodLight = new THREE.PointLight(0x7d202a, 6, 9, 2)
  oxbloodLight.position.set(-4, 0.5, 3)
  scene.add(oxbloodLight)
  const screenLight = new THREE.PointLight(0x83b966, 2.2, 4.5, 2)
  screenLight.position.set(-0.7, 0.2, 1.3)
  scene.add(screenLight)

  let sceneMode: OperatorTerminalMode = 'idle'
  let transitionProgress = 0
  let pointerX = 0
  let pointerY = 0
  const desiredCamera = baseCamera.clone()
  const desiredTarget = baseTarget.clone()
  const terminalCamera = new THREE.Vector3()
  const terminalTarget = new THREE.Vector3()
  const raycaster = new THREE.Raycaster()
  const screenMaterial = screen.material as THREE.MeshBasicMaterial

  function updateTerminalCamera() {
    monitor.updateWorldMatrix(true, false)
    terminalTarget.copy(monitor.localToWorld(new THREE.Vector3(0, 0, 0.46)))
    const verticalFov = THREE.MathUtils.degToRad(camera.fov)
    const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect)
    const verticalDistance = 1.14 / Math.tan(verticalFov / 2)
    const horizontalDistance = 1.68 / Math.tan(horizontalFov / 2)
    const distance = Math.max(verticalDistance, horizontalDistance) * 1.08
    terminalCamera.copy(monitor.localToWorld(new THREE.Vector3(0, 0, distance + 0.46)))
  }

  function updateSceneState(elapsed: number) {
    sourcePulse.visible = false
    hostPulse.visible = false
    sourceCable.mesh.material = cableIdle
    hostCable.mesh.material = cableIdle
    const eased = THREE.MathUtils.smoothstep(transitionProgress, 0, 1)
    desiredCamera.lerpVectors(baseCamera, terminalCamera, eased)
    desiredTarget.lerpVectors(baseTarget, terminalTarget, eased)

    if (sceneMode === 'idle') {
      desiredCamera.x += pointerX * 0.28
      desiredCamera.y -= pointerY * 0.18
      desiredTarget.x += pointerX * 0.08
      desiredTarget.y -= pointerY * 0.06
    }

    camera.position.copy(desiredCamera)
    camera.lookAt(desiredTarget)
    const baseLampIntensity = quality === 'high' ? 12 : 7
    lampGlow.intensity = THREE.MathUtils.lerp(baseLampIntensity + Math.sin(elapsed * 1.25) * 0.35, 1.1, eased)
    screenLight.intensity = THREE.MathUtils.lerp(2.2, 5.8, eased)
    screenMaterial.color.setScalar(THREE.MathUtils.lerp(0.88, 1.12, eased))
  }

  updateTerminalCamera()

  return {
    resize(width, height) {
      const safeWidth = Math.max(width, 1)
      const safeHeight = Math.max(height, 1)
      renderer.setSize(safeWidth, safeHeight, false)
      camera.aspect = safeWidth / safeHeight
      camera.updateProjectionMatrix()
      updateTerminalCamera()
    },
    setPointer(x, y) {
      pointerX = x
      pointerY = y
    },
    setMode(mode) {
      sceneMode = mode
    },
    setTransitionProgress(progress) {
      transitionProgress = Math.min(1, Math.max(0, progress))
    },
    setTerminalFrame(frame) {
      updateMonitorTexture(monitorTexture.canvas, monitorTexture.context, frame)
      monitorTexture.texture.needsUpdate = true
    },
    hitTestTerminalControl(x, y) {
      if (sceneMode !== 'terminal')
        return false
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
      const intersection = raycaster.intersectObject(screen, false)[0]
      return Boolean(intersection?.uv && intersection.uv.x >= 0.7 && intersection.uv.y >= 0.84)
    },
    render(elapsed) {
      updateSceneState(elapsed)
      renderer.render(scene, camera)
    },
    dispose() {
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
          object.geometry.dispose()
          const objectMaterials = Array.isArray(object.material) ? object.material : [object.material]
          objectMaterials.forEach((material) => {
            if ('map' in material && material.map instanceof THREE.Texture)
              material.map.dispose()
            material.dispose()
          })
          if (object.userData.disposableTexture instanceof THREE.Texture)
            object.userData.disposableTexture.dispose()
        }
      })
      woodTexture.dispose()
      monitorTexture.texture.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
