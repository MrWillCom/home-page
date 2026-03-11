'use client'

import styles from './Hanafubuki.module.scss'
import { Canvas } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'

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
      curveSegments: 32,
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

function Petal() {
  return (
    <mesh rotation={[-Math.PI / 4, 0, 0]}>
      <EllipsoidPlate width={1} height={0.6} depth={0.01} />
      <meshStandardMaterial color="#ff6dc4" />
    </mesh>
  )
}

export default function Hanafubuki() {
  return (
    <Canvas
      className={styles.canvas}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
    >
      <Petal />
      <ambientLight intensity={4} />
      <directionalLight intensity={4} />
    </Canvas>
  )
}
