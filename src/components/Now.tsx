'use client'

import styles from './Now.module.scss'
import { useState, useEffect } from 'react'
import { TZDate } from '@date-fns/tz'
import NumberFlow from '@number-flow/react'
import { TextMorph } from 'torph/react'

export default function Now({ timezone }: { timezone: string }) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [shouldUseTextMorph, setShouldUseTextMorph] = useState(false)
  const currentTZDate = new TZDate(currentDate, timezone)

  useEffect(() => {
    setCurrentDate(new Date())

    const intervalId = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <>
      {shouldUseTextMorph ? (
        <TextMorph onAnimationComplete={() => setShouldUseTextMorph(false)}>
          {currentTZDate.getHours().toString()}
        </TextMorph>
      ) : (
        <NumberFlow
          value={currentTZDate.getHours()}
          trend={1}
          onAnimationsFinish={() => {
            if (currentTZDate.getHours() === 23) {
              setShouldUseTextMorph(true)
            }
          }}
        />
      )}
      <span className={styles.colon}>:</span>
      <NumberFlow
        value={currentTZDate.getMinutes()}
        trend={1}
        digits={{ 1: { max: 5 } }}
        format={{ minimumIntegerDigits: 2 }}
      />
      <span className={styles.colon}>:</span>
      <NumberFlow
        value={currentTZDate.getSeconds()}
        trend={1}
        digits={{ 1: { max: 5 } }}
        format={{ minimumIntegerDigits: 2 }}
      />
    </>
  )
}
