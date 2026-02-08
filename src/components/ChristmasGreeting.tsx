'use client'

import { useEffect, useState } from 'react'
import { differenceInDays, differenceInHours, isAfter } from 'date-fns'
import styles from './ChristmasGreeting.module.scss'

export default function ChristmasGreeting() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
  } | null>(null)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const christmas = new Date(2026, 0, 1)

      if (isAfter(now, christmas)) {
        return null
      }

      const days = differenceInDays(christmas, now)
      const hours = differenceInHours(christmas, now)

      return { days, hours }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className={styles.sect}>
      <span className={styles.text}>新年快乐！🎊</span>
      {timeLeft && (
        <span className={styles.countdown}>
          coming in{' '}
          {timeLeft.days > 0
            ? `${timeLeft.days} day${timeLeft.days === 1 ? '' : 's'}`
            : `${timeLeft.hours} hour${timeLeft.hours === 1 ? '' : 's'}`}
        </span>
      )}
    </section>
  )
}
