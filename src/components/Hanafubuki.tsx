'use client'

import styles from './Hanafubuki.module.scss'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

interface HanafubukiConfig {
  maxCount: number
  baseCount: number
  density: number
  fallSpeed: number
  rotationSpeedMax: number
  scale: { min: number; max: number }
  swayX: { speed: [number, number]; amplitude: [number, number] }
  swayZ: { speed: [number, number]; amplitude: [number, number] }
  spawnArea: { depth: number }
  petal: {
    width: number
    height: number
    depth: number
    colors: string[]
    curveSegments: number
  }
}

const CONFIG: HanafubukiConfig = {
  maxCount: 500,
  baseCount: 20,
  density: 2,
  fallSpeed: 2,
  rotationSpeedMax: 0.02,
  scale: { min: 0.2, max: 0.5 },
  swayX: { speed: [0.5, 1], amplitude: [0.5, 2] },
  swayZ: { speed: [0.3, 0.7], amplitude: [0.5, 2] },
  spawnArea: { depth: 10 },
  petal: {
    width: 0.6,
    height: 0.3,
    depth: 0.01,
    colors: ['#ff6dc4', '#ffb7e5', '#ff94d2'],
    curveSegments: 16,
  },
}

const tempObject = new THREE.Object3D()

function EllipsoidPlate({
  width = 1,
  height = 0.6,
  depth = 0.05,
}: {
  width?: number
  height?: number
  depth?: number
}) {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.absellipse(0, 0, width / 2, height / 2, 0, Math.PI * 2, false, 0)
    return s
  }, [width, height])

  const extrudeSettings = useMemo(
    () => ({
      depth,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
      curveSegments: CONFIG.petal.curveSegments,
    }),
    [depth],
  )

  return (
    <extrudeGeometry
      args={[shape, extrudeSettings]}
      onUpdate={self => self.center()}
    />
  )
}

function Petals() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const { viewport } = useThree()
  const tempColor = useMemo(() => new THREE.Color(), [])

  // Pre-calculate random properties for all possible petals
  // Scaling positions based on viewport to ensure they are visible
  const data = useMemo(() => {
    return Array.from({ length: CONFIG.maxCount }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * viewport.width * 1.5,
        (Math.random() - 0.5) * viewport.height * 2,
        (Math.random() - 0.5) * CONFIG.spawnArea.depth,
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ),
      color:
        CONFIG.petal.colors[
          Math.floor(Math.random() * CONFIG.petal.colors.length)
        ],
      scale:
        CONFIG.scale.min +
        Math.random() * (CONFIG.scale.max - CONFIG.scale.min),
      // Animation factors
      rotationSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * CONFIG.rotationSpeedMax,
        (Math.random() - 0.5) * CONFIG.rotationSpeedMax,
        (Math.random() - 0.5) * CONFIG.rotationSpeedMax,
      ),
      swayX: {
        speed:
          CONFIG.swayX.speed[0] +
          Math.random() * (CONFIG.swayX.speed[1] - CONFIG.swayX.speed[0]),
        amplitude:
          CONFIG.swayX.amplitude[0] +
          Math.random() *
            (CONFIG.swayX.amplitude[1] - CONFIG.swayX.amplitude[0]),
        phase: Math.random() * Math.PI * 2,
      },
      swayZ: {
        speed:
          CONFIG.swayZ.speed[0] +
          Math.random() * (CONFIG.swayZ.speed[1] - CONFIG.swayZ.speed[0]),
        amplitude:
          CONFIG.swayZ.amplitude[0] +
          Math.random() *
            (CONFIG.swayZ.amplitude[1] - CONFIG.swayZ.amplitude[0]),
        phase: Math.random() * Math.PI * 2,
      },
    }))
  }, [])

  useFrame(state => {
    const mesh = meshRef.current
    if (!mesh) return
    const t = state.clock.elapsedTime

    data.forEach((item, i) => {
      // Apply constant rotation
      item.rotation.x += item.rotationSpeed.x
      item.rotation.y += item.rotationSpeed.y
      item.rotation.z += item.rotationSpeed.z

      // Calculate swaying offsets
      const offsetX =
        Math.sin(t * item.swayX.speed + item.swayX.phase) * item.swayX.amplitude
      const offsetZ =
        Math.cos(t * item.swayZ.speed + item.swayZ.phase) * item.swayZ.amplitude

      // Calculate falling position with wrapping based on viewport height
      // Using modulo to ensure continuous falling loop
      const halfHeight = viewport.height / 2 + 2
      const fullHeight = halfHeight * 2
      let y = item.position.y - (t % 1000000) * CONFIG.fallSpeed
      y =
        ((((y + halfHeight) % fullHeight) + fullHeight) % fullHeight) -
        halfHeight

      tempObject.position.set(
        item.position.x + offsetX,
        y,
        item.position.z + offsetZ,
      )
      tempObject.rotation.copy(item.rotation)
      tempObject.scale.setScalar(item.scale)
      tempObject.updateMatrix()
      mesh.setMatrixAt(i, tempObject.matrix)

      // Set instance color
      tempColor.set(item.color)
      mesh.setColorAt(i, tempColor)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  })

  // Determine active count based on viewport width
  // This uses the viewport width directly from React Three Fiber
  const count = useMemo(() => {
    return Math.min(
      CONFIG.maxCount,
      Math.floor(CONFIG.baseCount + viewport.width * CONFIG.density),
    )
  }, [viewport.width])

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, CONFIG.maxCount]}
      count={count}
      frustumCulled={false}
    >
      <EllipsoidPlate
        width={CONFIG.petal.width}
        height={CONFIG.petal.height}
        depth={CONFIG.petal.depth}
      />
      <meshStandardMaterial />
    </instancedMesh>
  )
}

export default function Hanafubuki() {
  return (
    <Canvas
      className={styles.canvas}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
      camera={{ position: [0, 0, 10], fov: 50 }}
    >
      <Petals />
      <ambientLight intensity={4} />
      <directionalLight intensity={4} position={[5, 5, 5]} />
    </Canvas>
  )
}
