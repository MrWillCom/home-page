'use client'

import styles from './Hanafubuki.module.scss'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useTheme } from 'next-themes'
import { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

interface HanafubukiConfig {
  density: number
  fallSpeed: number
  rotationSpeedMax: number
  scale: { min: number; max: number }
  swayX: { speed: [number, number]; amplitude: [number, number] }
  swayZ: { speed: [number, number]; amplitude: [number, number] }
  petal: {
    width: number
    height: number
    depth: number
    colors: string[]
  }
}

const CONFIG: HanafubukiConfig = {
  density: 3,
  fallSpeed: 2,
  rotationSpeedMax: 0.02,
  scale: { min: 0.2, max: 0.5 },
  swayX: { speed: [0.5, 1], amplitude: [0.5, 2] },
  swayZ: { speed: [0.3, 0.7], amplitude: [0.5, 2] },
  petal: {
    width: 0.6,
    height: 0.3,
    depth: 0.01,
    colors: [/* '#ffb7e5', */ '#ff94d2'],
  },
}

const MAX_COUNT = 500
const BASE_COUNT = 20
const CURVE_SEGMENTS = 16
const SPAWN_DEPTH = 30
const CAMERA_Z = 10
const NEAR_PLANE_BUFFER = 0.1
const Y_PADDING =
  CONFIG.scale.max +
  Math.max(CONFIG.swayX.amplitude[1], CONFIG.swayZ.amplitude[1])

const tempObject = new THREE.Object3D()
const tempColor = new THREE.Color()

function getFrustumSizeAtDistance(
  camera: THREE.PerspectiveCamera,
  distance: number,
  aspect: number,
) {
  const fovRad = (camera.fov * Math.PI) / 180
  const height = 2 * Math.tan(fovRad / 2) * distance
  const width = height * aspect
  return { width, height }
}

const PETAL_SHAPE = new THREE.Shape()
PETAL_SHAPE.absellipse(
  0,
  0,
  CONFIG.petal.width / 2,
  CONFIG.petal.height / 2,
  0,
  Math.PI * 2,
  false,
  0,
)

function EllipsoidPlate({ depth = 0.05 }: { depth?: number }) {
  const extrudeSettings = useMemo(
    () => ({
      depth,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
      curveSegments: CURVE_SEGMENTS,
    }),
    [depth],
  )

  return <extrudeGeometry args={[PETAL_SHAPE, extrudeSettings]} />
}

function Petals() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const { viewport, camera } = useThree()
  const pCamera = camera as THREE.PerspectiveCamera

  const data = useMemo(() => {
    const aspect = viewport.width / viewport.height

    return Array.from({ length: MAX_COUNT }).map(() => {
      const z =
        (Math.random() - 1) * SPAWN_DEPTH + (CAMERA_Z - NEAR_PLANE_BUFFER)

      const distance = Math.abs(CAMERA_Z - z)
      const frustum = getFrustumSizeAtDistance(pCamera, distance, aspect)

      const rangeX = frustum.width * 1.5
      const rangeY = frustum.height + Y_PADDING * 2

      return {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * rangeX,
          (Math.random() - 0.5) * rangeY,
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
        scale:
          CONFIG.scale.min +
          Math.random() * (CONFIG.scale.max - CONFIG.scale.min),
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
        wrapHeight: rangeY,
      }
    })
  }, [pCamera.fov, viewport.width, viewport.height])

  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    data.forEach((petal, i) => {
      tempColor.set(petal.color)
      mesh.setColorAt(i, tempColor)
    })
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [data])

  useFrame(state => {
    const mesh = meshRef.current
    if (!mesh) return
    const t = state.clock.elapsedTime

    data.forEach((petal, i) => {
      petal.rotation.x += petal.rotationSpeed.x
      petal.rotation.y += petal.rotationSpeed.y
      petal.rotation.z += petal.rotationSpeed.z

      const offsetX =
        Math.sin(t * petal.swayX.speed + petal.swayX.phase) *
        petal.swayX.amplitude
      const offsetZ =
        Math.cos(t * petal.swayZ.speed + petal.swayZ.phase) *
        petal.swayZ.amplitude

      const halfHeight = petal.wrapHeight / 2
      const fullHeight = petal.wrapHeight
      let y = petal.position.y - (t % 1000000) * CONFIG.fallSpeed
      y =
        ((((y + halfHeight) % fullHeight) + fullHeight) % fullHeight) -
        halfHeight

      tempObject.position.set(
        petal.position.x + offsetX,
        y,
        petal.position.z + offsetZ,
      )
      tempObject.rotation.copy(petal.rotation)
      tempObject.scale.setScalar(petal.scale)
      tempObject.updateMatrix()
      mesh.setMatrixAt(i, tempObject.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  const count = useMemo(() => {
    return Math.min(
      MAX_COUNT,
      Math.floor(BASE_COUNT + viewport.width * CONFIG.density),
    )
  }, [viewport.width])

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, MAX_COUNT]}
      count={count}
      frustumCulled={false}
    >
      <EllipsoidPlate depth={CONFIG.petal.depth} />
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
      <EffectComposer>
        {[
          isDarkTheme ? (
            <Bloom
              key="bloom"
              luminanceThreshold={0.2}
              mipmapBlur
              intensity={1.0}
              radius={0.4}
            />
          ) : null,
        ].filter(el => el !== null)}
      </EffectComposer>
    </Canvas>
  )
}
