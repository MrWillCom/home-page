'use client'

import { useEffect, useState } from 'react'
import {
  addYears,
  differenceInDays,
  differenceInHours,
  getYear,
  isAfter,
} from 'date-fns'
import styles from './ChristmasGreeting.module.scss'

export default function ChristmasGreeting() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
  } | null>(null)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      let christmas = new Date(getYear(now), 11, 25)

      if (isAfter(now, christmas)) {
        christmas = addYears(christmas, 1)
      }

      const days = differenceInDays(christmas, now)
      const hours = differenceInHours(christmas, now) % 24

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
      <span className={styles.text}>Merry Christmas! 🎄</span>
      {timeLeft && (timeLeft.days > 0 || timeLeft.hours > 0) && (
        <span className={styles.countdown}>
          coming in{' '}
          {[
            timeLeft.days > 0
              ? `${timeLeft.days} day${timeLeft.days === 1 ? '' : 's'}`
              : null,
            timeLeft.hours > 0
              ? `${timeLeft.hours} hour${timeLeft.hours === 1 ? '' : 's'}`
              : null,
          ]
            .filter(Boolean)
            .join(' ')}
        </span>
      )}
    </section>
  )
}
