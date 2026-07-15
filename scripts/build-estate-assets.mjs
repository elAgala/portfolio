import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import * as THREE from 'three'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'

class NodeFileReader {
  result = null
  onloadend = null
  onerror = null

  async readAsArrayBuffer(blob) {
    try {
      this.result = await blob.arrayBuffer()
      this.onloadend?.()
    }
    catch (error) {
      this.onerror?.(error)
    }
  }

  async readAsDataURL(blob) {
    try {
      const buffer = Buffer.from(await blob.arrayBuffer())
      this.result = `data:${blob.type};base64,${buffer.toString('base64')}`
      this.onloadend?.()
    }
    catch (error) {
      this.onerror?.(error)
    }
  }
}

globalThis.FileReader ??= NodeFileReader

const outputDirectory = resolve('public/models')
const gltfTransform = resolve('node_modules/.bin/gltf-transform')
mkdirSync(outputDirectory, { recursive: true })

function palette() {
  return {
    ink: new THREE.MeshStandardMaterial({ name: 'Ink', color: 0x090706, metalness: 0.12, roughness: 0.82 }),
    walnut: new THREE.MeshStandardMaterial({ name: 'Walnut', color: 0x2c1510, metalness: 0.14, roughness: 0.42 }),
    walnutDark: new THREE.MeshStandardMaterial({ name: 'WalnutDark', color: 0x140b08, metalness: 0.1, roughness: 0.58 }),
    brass: new THREE.MeshStandardMaterial({ name: 'AgedBrass', color: 0xa98047, metalness: 0.88, roughness: 0.25 }),
    marble: new THREE.MeshStandardMaterial({ name: 'NeroMarble', color: 0x161413, metalness: 0.2, roughness: 0.28 }),
    leather: new THREE.MeshStandardMaterial({ name: 'OxbloodLeather', color: 0x4b1117, metalness: 0.06, roughness: 0.5 }),
    paper: new THREE.MeshStandardMaterial({ name: 'Parchment', color: 0xdccbb1, metalness: 0, roughness: 0.86 }),
    glass: new THREE.MeshStandardMaterial({ name: 'SmokedGlass', color: 0x171012, metalness: 0.52, roughness: 0.12 }),
    dawn: new THREE.MeshStandardMaterial({ name: 'Dawn', color: 0x5b241d, emissive: 0x45140f, emissiveIntensity: 1.8, roughness: 0.75 }),
  }
}

function mesh(parent, name, geometry, material, position, rotation = [0, 0, 0], scale = [1, 1, 1]) {
  const object = new THREE.Mesh(geometry, material)
  object.name = name
  object.position.set(...position)
  object.rotation.set(...rotation)
  object.scale.set(...scale)
  object.castShadow = true
  object.receiveShadow = true
  parent.add(object)
  return object
}

function box(parent, name, size, material, position, rotation) {
  return mesh(parent, name, new THREE.BoxGeometry(...size), material, position, rotation)
}

function addThreshold(root, materials, detail) {
  const group = new THREE.Group()
  group.name = 'Threshold'
  group.position.set(0, 0, 10)
  root.add(group)

  box(group, 'ThresholdFloor', [12, 0.22, 10], materials.marble, [0, -0.12, 0])
  box(group, 'ThresholdWall', [12, 7.5, 0.35], materials.ink, [0, 3.55, -1.6])
  box(group, 'ThresholdLintel', [7.4, 0.55, 0.75], materials.walnutDark, [0, 6.65, -1.05])
  box(group, 'ThresholdPillarLeft', [0.65, 7, 0.8], materials.walnut, [-3.7, 3.25, -1.05])
  box(group, 'ThresholdPillarRight', [0.65, 7, 0.8], materials.walnut, [3.7, 3.25, -1.05])

  const leftPivot = new THREE.Group()
  leftPivot.name = 'ThresholdDoorLeft'
  leftPivot.position.set(-3.3, 0, -0.9)
  box(leftPivot, 'ThresholdDoorLeftPanel', [3.25, 6.2, 0.35], materials.walnut, [1.62, 3.15, 0])
  group.add(leftPivot)
  const rightPivot = new THREE.Group()
  rightPivot.name = 'ThresholdDoorRight'
  rightPivot.position.set(3.3, 0, -0.9)
  box(rightPivot, 'ThresholdDoorRightPanel', [3.25, 6.2, 0.35], materials.walnut, [-1.62, 3.15, 0])
  group.add(rightPivot)

  const panelCount = detail === 'high' ? 6 : 3
  for (let index = 0; index < panelCount; index += 1) {
    const y = 1.1 + (index % 3) * 1.65
    const side = index < 3 ? -1 : 1
    const x = side * 1.72
    box(group, `ThresholdCarving${index}`, [2.2, 1.15, 0.08], materials.walnutDark, [x, y, -0.69])
  }

  mesh(group, 'ThresholdMonogram', new THREE.CylinderGeometry(1.15, 1.15, 0.045, detail === 'high' ? 64 : 32), materials.brass, [0, 0.035, 2.2])
  mesh(group, 'ThresholdMonogramInset', new THREE.TorusGeometry(0.82, 0.045, 12, detail === 'high' ? 64 : 32), materials.ink, [0, 0.075, 2.2], [Math.PI / 2, 0, 0])
  return group
}

function addLamp(group, materials, detail) {
  const lamp = new THREE.Group()
  lamp.name = 'StudyLamp'
  lamp.position.set(-2.25, 0.75, 0.3)
  mesh(lamp, 'LampBase', new THREE.CylinderGeometry(0.46, 0.62, 0.12, detail === 'high' ? 32 : 16), materials.brass, [0, 0, 0])
  mesh(lamp, 'LampStem', new THREE.CylinderGeometry(0.04, 0.055, 1.55, 12), materials.brass, [0, 0.8, 0])
  mesh(lamp, 'LampShade', new THREE.CylinderGeometry(0.38, 0.8, 0.55, detail === 'high' ? 32 : 16, 1, true), materials.leather, [0, 1.62, 0], [0, 0, Math.PI])
  group.add(lamp)
}

function addStudy(root, materials, detail) {
  const group = new THREE.Group()
  group.name = 'Study'
  root.add(group)
  box(group, 'StudyFloor', [14, 0.25, 14], materials.walnutDark, [0, -0.15, 0])
  box(group, 'StudyBackWall', [14, 7.5, 0.3], materials.ink, [0, 3.5, -6.8])
  box(group, 'StudyDeskTop', [7.5, 0.34, 3.15], materials.walnut, [0, 1, -0.8])
  box(group, 'StudyDeskApron', [7.1, 0.95, 0.25], materials.walnutDark, [0, 0.48, 0.62])
  for (const x of [-3.15, 3.15])
    box(group, `StudyDeskLeg${x}`, [0.4, 1, 2.5], materials.walnutDark, [x, 0.5, -0.8])
  box(group, 'StudyDossier', [2.7, 0.06, 1.8], materials.paper, [0.7, 1.23, -0.6], [0, -0.08, 0])
  mesh(group, 'StudySeal', new THREE.CylinderGeometry(0.42, 0.46, 0.09, 32), materials.leather, [1.55, 1.31, -0.2])
  addLamp(group, materials, detail)

  const phone = new THREE.Group()
  phone.name = 'StudyTelephone'
  phone.position.set(2.45, 1.25, -1)
  box(phone, 'PhoneBody', [1.25, 0.35, 0.85], materials.glass, [0, 0, 0])
  mesh(phone, 'PhoneDial', new THREE.TorusGeometry(0.26, 0.055, 12, 32), materials.brass, [0, 0.2, 0.43])
  box(phone, 'PhoneReceiver', [1.5, 0.17, 0.23], materials.glass, [0, 0.42, 0])
  group.add(phone)

  const slatCount = detail === 'high' ? 14 : 7
  for (let index = 0; index < slatCount; index += 1)
    box(group, `StudyBlind${index}`, [5.4, 0.06, 0.09], materials.brass, [-2.6, 5.7 - index * 0.31, -6.55], [0, 0, -0.04])
  return group
}

function addCouncil(root, materials, detail) {
  const group = new THREE.Group()
  group.name = 'CouncilTable'
  group.position.set(12, 0, -4)
  root.add(group)
  box(group, 'CouncilFloor', [18, 0.25, 14], materials.marble, [0, -0.15, 0])
  box(group, 'CouncilBackWall', [18, 7, 0.3], materials.ink, [0, 3.35, -6.7])
  box(group, 'CouncilTableTop', [12.5, 0.38, 4.2], materials.walnut, [0, 1.15, 0])
  box(group, 'CouncilTableBase', [9.2, 1.2, 2.5], materials.walnutDark, [0, 0.55, 0])
  const anchorX = [-3.8, 0, 3.8]
  const names = ['AnchorAgalaUI', 'AnchorAgalaDeploy', 'AnchorAgalaAI']
  anchorX.forEach((x, index) => {
    const anchor = new THREE.Group()
    anchor.name = names[index]
    anchor.position.set(x, 1.48, 0)
    group.add(anchor)
    mesh(anchor, `${names[index]}Plinth`, new THREE.CylinderGeometry(0.95, 1.12, 0.16, detail === 'high' ? 48 : 24), materials.glass, [0, 0, 0])
    mesh(anchor, `${names[index]}Ring`, new THREE.TorusGeometry(0.67, 0.035, 10, detail === 'high' ? 48 : 24), materials.brass, [0, 0.12, 0], [Math.PI / 2, 0, 0])
  })
  return group
}

function addArchive(root, materials, detail) {
  const group = new THREE.Group()
  group.name = 'Archive'
  group.position.set(24, 0, -2)
  root.add(group)
  box(group, 'ArchiveFloor', [15, 0.25, 13], materials.walnutDark, [0, -0.15, 0])
  box(group, 'ArchiveBackWall', [15, 7.5, 0.3], materials.ink, [0, 3.5, -6.3])
  const columns = detail === 'high' ? 5 : 3
  const rows = detail === 'high' ? 6 : 4
  for (let column = 0; column < columns; column += 1) {
    for (let row = 0; row < rows; row += 1) {
      const x = (column - (columns - 1) / 2) * 1.62
      const y = 0.65 + row * 0.82
      const drawer = box(group, `ArchiveDrawer${column}-${row}`, [1.42, 0.68, 0.58], materials.walnut, [x, y, -5.8])
      box(drawer, `ArchiveLabel${column}-${row}`, [0.48, 0.18, 0.05], materials.brass, [0, 0, 0.32])
    }
  }
  const featureDrawer = box(group, 'ArchiveDrawerFeature', [3.2, 0.35, 2.2], materials.paper, [-2.1, 1.35, -1.6], [-0.08, 0.14, -0.04])
  box(featureDrawer, 'ArchivePortraitMount', [1.05, 0.04, 1.35], materials.glass, [-0.68, 0.2, 0.18])
  mesh(featureDrawer, 'ArchiveWaxSeal', new THREE.CylinderGeometry(0.34, 0.37, 0.08, 32), materials.leather, [0.85, 0.2, 0.2])
  return group
}

function addDecision(root, materials, detail) {
  const group = new THREE.Group()
  group.name = 'Decision'
  group.position.set(32, 0, 7)
  root.add(group)
  box(group, 'DecisionFloor', [14, 0.25, 12], materials.marble, [0, -0.15, 0])
  box(group, 'DecisionWall', [14, 7.5, 0.35], materials.ink, [0, 3.5, -4.7])
  box(group, 'DecisionPillarLeft', [0.7, 7.2, 0.9], materials.walnut, [-3.3, 3.3, -4.25])
  box(group, 'DecisionPillarRight', [0.7, 7.2, 0.9], materials.walnut, [3.3, 3.3, -4.25])
  box(group, 'DecisionDawn', [5.85, 6.5, 0.08], materials.dawn, [0, 3.25, -4.52])
  const leftDoor = new THREE.Group()
  leftDoor.name = 'DecisionDoorLeft'
  leftDoor.position.set(-2.85, 0, -4.1)
  box(leftDoor, 'DecisionDoorLeftPanel', [2.8, 6.3, 0.3], materials.walnutDark, [1.4, 3.15, 0])
  group.add(leftDoor)
  const rightDoor = new THREE.Group()
  rightDoor.name = 'DecisionDoorRight'
  rightDoor.position.set(2.85, 0, -4.1)
  box(rightDoor, 'DecisionDoorRightPanel', [2.8, 6.3, 0.3], materials.walnutDark, [-1.4, 3.15, 0])
  group.add(rightDoor)
  box(group, 'DecisionConsole', [5.8, 0.28, 1.9], materials.walnut, [0, 1.05, 0.9])
  box(group, 'DecisionEnvelope', [2.4, 0.05, 1.35], materials.paper, [-0.45, 1.23, 0.7], [0, 0.12, 0])
  mesh(group, 'DecisionSeal', new THREE.CylinderGeometry(0.42, 0.48, 0.09, detail === 'high' ? 48 : 24), materials.leather, [0.3, 1.3, 0.7])
  return group
}

function buildAsset(part, detail) {
  const root = new THREE.Group()
  root.name = part === 'core' ? 'EstateCore' : 'EstateDetail'
  const materials = palette()
  if (part === 'core') {
    addThreshold(root, materials, detail)
    addStudy(root, materials, detail)
    addCouncil(root, materials, detail)
  }
  else {
    addArchive(root, materials, detail)
    addDecision(root, materials, detail)
  }
  return root
}

async function exportAsset(part, detail) {
  const root = buildAsset(part, detail)
  const exporter = new GLTFExporter()
  const result = await exporter.parseAsync(root, {
    binary: true,
    onlyVisible: false,
    trs: true,
  })
  const rawPath = join(tmpdir(), `estate-${part}-${detail}-raw.glb`)
  const outputPath = join(outputDirectory, `estate-${part}-${detail}.glb`)
  writeFileSync(rawPath, Buffer.from(result))
  execFileSync(gltfTransform, ['meshopt', rawPath, outputPath, '--level', 'high'], { stdio: 'inherit' })
}

for (const detail of ['high', 'balanced']) {
  await exportAsset('core', detail)
  await exportAsset('detail', detail)
}

console.log(`Estate assets written to ${outputDirectory}`)
