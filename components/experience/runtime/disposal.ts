import * as THREE from 'three'

function disposeMaterial(material: THREE.Material) {
  for (const value of Object.values(material)) {
    if (value instanceof THREE.Texture)
      value.dispose()
  }
  material.dispose()
}

export function disposeObject3D(root: THREE.Object3D) {
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh) && !(object instanceof THREE.Points) && !(object instanceof THREE.Line))
      return
    object.geometry?.dispose()
    const materials = Array.isArray(object.material) ? object.material : [object.material]
    materials.filter(Boolean).forEach(disposeMaterial)
  })
  root.removeFromParent()
}
