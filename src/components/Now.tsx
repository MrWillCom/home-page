'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { TZDate } from '@date-fns/tz'

export default function Now({
  timezone,
  formatStr,
}: {
  timezone: string
  formatStr: string
}) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  useEffect(() => {
    setCurrentDate(new Date())

    const intervalId = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return format(new TZDate(currentDate, timezone), formatStr)
}
