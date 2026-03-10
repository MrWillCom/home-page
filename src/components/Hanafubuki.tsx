'use client'

import styles from './Hanafubuki.module.scss'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'

type RotatingMesh = {
  rotation: {
    x: number
    y: number
    z: number
  }
}

function RotatingBox() {
  const meshRef = useRef<RotatingMesh | null>(null)

  useFrame((_state, delta) => {
    if (!meshRef.current) {
      return
    }

    meshRef.current.rotation.x += delta * 0.6
    meshRef.current.rotation.y += delta * 0.9
    meshRef.current.rotation.z += delta * 0.3
  })

  return (
    <mesh ref={meshRef} rotation={[0.2, 0.3, 0.1]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshPhongMaterial />
    </mesh>
  )
}

export default function Hanafubuki() {
  return (
    <Canvas
      className={styles.canvas}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
    >
      <RotatingBox />
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} color="red" />
    </Canvas>
  )
}
