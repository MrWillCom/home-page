'use client'

import styles from './Hanafubuki.module.scss'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useTheme } from 'next-themes'
import { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

const rand = (min: number, max: number) => min + Math.random() * (max - min)

const CONFIG = {
  maxCount: 500,
  baseCount: 20,
  density: 3,
  spawnDistance: [15, 30],
  fallSpeed: 2,
  rotationSpeed: [-0.02, 0.02],
  scale: [0.5, 0.6],
  swayX: {
    speed: [0.5, 1],
    amplitude: [0.5, 2],
  },
  swayZ: {
    speed: [0.3, 0.7],
    amplitude: [0.5, 2],
  },
  petal: {
    width: 0.6,
    height: 0.3,
    depth: 0.01,
    colors: ['#ff94d2'],
    curveSegments: 16,
  },
} as const satisfies {
  maxCount: number
  baseCount: number
  density: number
  spawnDistance: [number, number]
  fallSpeed: number
  rotationSpeed: [number, number]
  scale: [number, number]
  swayX: { speed: [number, number]; amplitude: [number, number] }
  swayZ: { speed: [number, number]; amplitude: [number, number] }
  petal: {
    width: number
    height: number
    depth: number
    colors: string[]
    curveSegments: number
  }
}

const scratchObject3D = new THREE.Object3D()
const petalShape = new THREE.Shape()
petalShape.absellipse(
  0,
  0,
  CONFIG.petal.width / 2,
  CONFIG.petal.height / 2,
  0,
  Math.PI * 2,
  false,
  0,
)

function Petals() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const { viewport, camera } = useThree()
  const perspectiveCamera = camera as THREE.PerspectiveCamera

  const extrudeSettings = useMemo(
    () => ({
      depth: CONFIG.petal.depth,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
      curveSegments: CONFIG.petal.curveSegments,
    }),
    [],
  )

  const { data, count, wrapHeight } = useMemo(() => {
    const aspect = viewport.width / viewport.height
    const midDistance = (CONFIG.spawnDistance[0] + CONFIG.spawnDistance[1]) / 2
    const fovRadians = (perspectiveCamera.fov * Math.PI) / 180
    const frustumHeight = 2 * Math.tan(fovRadians / 2) * midDistance
    const frustumWidth = frustumHeight * aspect
    const yPadding =
      CONFIG.scale[1] +
      Math.max(CONFIG.swayX.amplitude[1], CONFIG.swayZ.amplitude[1])
    const wrapHeight = frustumHeight + yPadding * 2

    const data = Array.from({ length: CONFIG.maxCount }, () => {
      const z =
        perspectiveCamera.position.z -
        rand(CONFIG.spawnDistance[0], CONFIG.spawnDistance[1])

      return {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * frustumWidth * 1.5,
          (Math.random() - 0.5) * wrapHeight,
          z,
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
        scale: rand(CONFIG.scale[0], CONFIG.scale[1]),
        rotationSpeed: new THREE.Vector3(
          rand(CONFIG.rotationSpeed[0], CONFIG.rotationSpeed[1]),
          rand(CONFIG.rotationSpeed[0], CONFIG.rotationSpeed[1]),
          rand(CONFIG.rotationSpeed[0], CONFIG.rotationSpeed[1]),
        ),
        swaySpeedX: rand(CONFIG.swayX.speed[0], CONFIG.swayX.speed[1]),
        swayAmplitudeX: rand(
          CONFIG.swayX.amplitude[0],
          CONFIG.swayX.amplitude[1],
        ),
        swayPhaseX: Math.random() * Math.PI * 2,
        swaySpeedZ: rand(CONFIG.swayZ.speed[0], CONFIG.swayZ.speed[1]),
        swayAmplitudeZ: rand(
          CONFIG.swayZ.amplitude[0],
          CONFIG.swayZ.amplitude[1],
        ),
        swayPhaseZ: Math.random() * Math.PI * 2,
      }
    })

    const count = Math.min(
      CONFIG.maxCount,
      Math.floor(CONFIG.baseCount + viewport.width * CONFIG.density),
    )

    return { data, count, wrapHeight }
  }, [perspectiveCamera, viewport.width, viewport.height])

  const colorsSet = useRef(false)
  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh || colorsSet.current) return
    const color = new THREE.Color()
    data.forEach((petal, i) => {
      color.set(petal.color)
      mesh.setColorAt(i, color)
    })
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    colorsSet.current = true
  }, [data])

  useFrame(state => {
    const mesh = meshRef.current
    if (!mesh) return
    const elapsedTime = state.clock.elapsedTime

    mesh.count = count
    const halfHeight = wrapHeight / 2
    for (let i = 0; i < count; i++) {
      const petal = data[i]
      petal.rotation.x += petal.rotationSpeed.x
      petal.rotation.y += petal.rotationSpeed.y
      petal.rotation.z += petal.rotationSpeed.z

      const offsetX =
        Math.sin(elapsedTime * petal.swaySpeedX + petal.swayPhaseX) *
        petal.swayAmplitudeX
      const offsetZ =
        Math.cos(elapsedTime * petal.swaySpeedZ + petal.swayPhaseZ) *
        petal.swayAmplitudeZ

      let y = petal.position.y - (elapsedTime % 1000000) * CONFIG.fallSpeed
      y =
        ((((y + halfHeight) % wrapHeight) + wrapHeight) % wrapHeight) -
        halfHeight

      scratchObject3D.position.set(
        petal.position.x + offsetX,
        y,
        petal.position.z + offsetZ,
      )
      scratchObject3D.rotation.copy(petal.rotation)
      scratchObject3D.scale.setScalar(petal.scale)
      scratchObject3D.updateMatrix()
      mesh.setMatrixAt(i, scratchObject3D.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, CONFIG.maxCount]}
      count={count}
      frustumCulled={false}
    >
      <extrudeGeometry args={[petalShape, extrudeSettings]} />
      <meshStandardMaterial />
    </instancedMesh>
  )
}

export default function Hanafubuki() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkTheme = mounted && resolvedTheme === 'dark'

  return (
    <Canvas
      className={styles.canvas}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
      camera={{ position: [0, 0, 10], fov: 50 }}
      gl={{ antialias: false }}
    >
      <Petals />
      <ambientLight intensity={isDarkTheme ? 4 : 7} />
      <directionalLight intensity={isDarkTheme ? 4 : 2} position={[5, 5, 5]} />
    </Canvas>
  )
}
