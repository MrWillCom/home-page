'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Snowy.module.scss'

interface Snowflake {
  id: number
  style: React.CSSProperties
}

export default function Snowy() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([])
  const nextId = useRef(0)
  const targetCount = useRef(0)

  const createSnowflake = useCallback((initial = false): Snowflake => {
    const duration = Math.random() * 8 + 6
    const drift = (Math.random() - 0.5) * 100
    const swayAmount = Math.random() * 15 + 5
    const swayDuration = Math.random() * 3 + 3

    return {
      id: nextId.current++,
      style: {
        '--left': `${Math.random() * 100}vw`,
        '--size': `${Math.random() * 3 + 2}px`,
        '--opacity': Math.random() * 0.5 + 0.3,
        '--duration': `${duration}s`,
        '--delay': initial ? `${Math.random() * -10}s` : '0s',
        '--drift': `${drift}px`,
        '--sway-amount': `${swayAmount}px`,
        '--sway-duration': `${swayDuration}s`,
        '--sway-delay': `${Math.random() * -5}s`,
      } as React.CSSProperties,
    }
  }, [])

  useEffect(() => {
    const updateTargetCount = () => {
      targetCount.current = Math.floor(window.innerWidth / 6)
    }

    updateTargetCount()
    setSnowflakes(
      Array.from({ length: targetCount.current }, () => createSnowflake(true)),
    )

    const handleResize = () => {
      updateTargetCount()
      setSnowflakes(prev => {
        if (prev.length < targetCount.current) {
          const needed = targetCount.current - prev.length
          const newFlakes = Array.from({ length: needed }, () =>
            createSnowflake(true),
          )
          return [...prev, ...newFlakes]
        }
        return prev
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [createSnowflake])

  const handleAnimationEnd = (id: number) => {
    setSnowflakes(prev => {
      const remaining = prev.filter(flake => flake.id !== id)
      if (remaining.length < targetCount.current) {
        return [...remaining, createSnowflake(false)]
      }
      return remaining
    })
  }

  return (
    <div className={styles.snowy}>
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          className={styles.flakeWrapper}
          style={flake.style}
          onAnimationEnd={() => handleAnimationEnd(flake.id)}
        >
          <div className={styles.flake} />
        </div>
      ))}
    </div>
  )
}
