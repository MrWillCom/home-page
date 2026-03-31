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
  density: 1,
  spawnDistance: [15, 30],
  fallSpeed: 2,
  spinSpeed: [-2, 2],
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
  nearPetal: {
    maxConcurrent: 8,
    spawnInterval: [2500, 5000],
    size: [400, 480],
    aspectRatio: [1.1, 1.3],
    duration: [3000, 5000],
    blurRadius: 160,
    alpha: { dark: 0.3, light: 0.3 },
    startAngle: [-180, 180],
    spinAngle: [30, 60],
  },
} as const satisfies {
  maxCount: number
  baseCount: number
  density: number
  spawnDistance: [number, number]
  fallSpeed: number
  spinSpeed: [number, number]
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
  nearPetal: {
    maxConcurrent: number
    spawnInterval: [number, number]
    size: [number, number]
    aspectRatio: [number, number]
    duration: [number, number]
    blurRadius: number
    alpha: { dark: number; light: number }
    startAngle: [number, number]
    spinAngle: [number, number]
  }
}

const scratchObject3D = new THREE.Object3D()
const spinQuat = new THREE.Quaternion()
const resultQuat = new THREE.Quaternion()
const Z_AXIS = new THREE.Vector3(0, 0, 1)
const MAX_TILT_ANGLE = Math.PI / 3
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
        tilt: (() => {
          const angle = Math.random() * Math.PI * 2
          const tiltAxis = new THREE.Vector3(
            Math.cos(angle),
            Math.sin(angle),
            0,
          )
          return new THREE.Quaternion().setFromAxisAngle(
            tiltAxis,
            (Math.random() - 0.5) * 2 * MAX_TILT_ANGLE,
          )
        })(),
        spinAngle: Math.random() * Math.PI * 2,
        spinSpeed: rand(CONFIG.spinSpeed[0], CONFIG.spinSpeed[1]),
        color:
          CONFIG.petal.colors[
            Math.floor(Math.random() * CONFIG.petal.colors.length)
          ],
        scale: rand(CONFIG.scale[0], CONFIG.scale[1]),
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
    const delta = state.clock.getDelta()

    mesh.count = count
    const halfHeight = wrapHeight / 2
    for (let i = 0; i < count; i++) {
      const petal = data[i]
      petal.spinAngle += petal.spinSpeed * delta

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

      spinQuat.setFromAxisAngle(Z_AXIS, petal.spinAngle)
      resultQuat.multiplyQuaternions(petal.tilt, spinQuat)
      scratchObject3D.position.set(
        petal.position.x + offsetX,
        y,
        petal.position.z + offsetZ,
      )
      scratchObject3D.quaternion.copy(resultQuat)
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

function NearPetals() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkTheme = mounted && resolvedTheme === 'dark'

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const petalLayer = container

    const maxRadius =
      (Math.max(CONFIG.nearPetal.size[0], CONFIG.nearPetal.size[1]) *
        Math.max(
          CONFIG.nearPetal.aspectRatio[0],
          CONFIG.nearPetal.aspectRatio[1],
        )) /
      2

    let timeoutId: ReturnType<typeof setTimeout>

    function spawn() {
      if (petalLayer.children.length >= CONFIG.nearPetal.maxConcurrent) {
        scheduleNext()
        return
      }

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const spawnOffset = maxRadius + CONFIG.nearPetal.blurRadius

      const baseSize = rand(CONFIG.nearPetal.size[0], CONFIG.nearPetal.size[1])
      const ratio = rand(
        CONFIG.nearPetal.aspectRatio[0],
        CONFIG.nearPetal.aspectRatio[1],
      )
      const width = baseSize * ratio
      const height = baseSize
      const duration = rand(
        CONFIG.nearPetal.duration[0],
        CONFIG.nearPetal.duration[1],
      )

      const petalHalfHeight = height / 2
      const fromX = rand(-spawnOffset, viewportWidth + spawnOffset)
      const toX = rand(-spawnOffset, viewportWidth + spawnOffset)
      const fromY = rand(
        -spawnOffset,
        -(petalHalfHeight + CONFIG.nearPetal.blurRadius),
      )
      const toY = rand(
        viewportHeight + petalHalfHeight + CONFIG.nearPetal.blurRadius,
        viewportHeight + spawnOffset,
      )

      const startAngle = rand(
        CONFIG.nearPetal.startAngle[0],
        CONFIG.nearPetal.startAngle[1],
      )
      const spinAngle =
        rand(CONFIG.nearPetal.spinAngle[0], CONFIG.nearPetal.spinAngle[1]) *
        (Math.random() < 0.5 ? -1 : 1)

      const petal = document.createElement('div')
      petal.className = styles.nearPetal
      petal.style.setProperty('--fromX', `${fromX - width / 2}px`)
      petal.style.setProperty('--fromY', `${fromY - height / 2}px`)
      petal.style.setProperty('--toX', `${toX - width / 2}px`)
      petal.style.setProperty('--toY', `${toY - height / 2}px`)
      petal.style.setProperty('--rotFrom', `${startAngle}deg`)
      petal.style.setProperty('--rotTo', `${startAngle + spinAngle}deg`)
      petal.style.setProperty('--duration', `${duration}ms`)
      petal.style.setProperty('--blur', `${CONFIG.nearPetal.blurRadius}px`)
      petal.style.setProperty('--width', `${width}px`)
      petal.style.setProperty('--height', `${height}px`)
      const alpha = isDarkTheme
        ? CONFIG.nearPetal.alpha.dark
        : CONFIG.nearPetal.alpha.light
      petal.style.setProperty(
        '--bg',
        `radial-gradient(hsl(340 ${isDarkTheme ? '80% 70%' : '100% 80%'} / ${alpha.toString()}), hsl(340 ${isDarkTheme ? '80% 70%' : '100% 80%'} / 0) 70%)`,
      )

      petalLayer.appendChild(petal)

      petal.addEventListener('animationend', () => {
        petal.remove()
      })

      scheduleNext()
    }

    function scheduleNext() {
      const delay = rand(
        CONFIG.nearPetal.spawnInterval[0],
        CONFIG.nearPetal.spawnInterval[1],
      )
      timeoutId = setTimeout(spawn, delay)
    }

    scheduleNext()

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isDarkTheme])

  return <div ref={containerRef} className={styles.nearPetalLayer} />
}

export default function Hanafubuki() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkTheme = mounted && resolvedTheme === 'dark'

  return (
    <>
      <Canvas
        className={styles.canvas}
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: false }}
      >
        <Petals />
        <ambientLight intensity={!isDarkTheme ? 8 : 2} />
        <directionalLight
          intensity={!isDarkTheme ? 3 : 1.5}
          position={[5, 5, 5]}
        />
      </Canvas>
      <NearPetals />
    </>
  )
}
