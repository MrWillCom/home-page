'use client'

import _ from 'lodash'
import { useState } from 'react'
import { useOpenPanel } from '@openpanel/nextjs'
import { greetings, getRandomGreeting } from '@/data/greetings'

interface RandomGreetingProps {
  initial: (typeof greetings)[number]
}

export default function RandomGreeting({ initial }: RandomGreetingProps) {
  const [currentGreeting, setCurrentGreeting] = useState(initial)
  const op = useOpenPanel()

  return (
    <>
      <span
        onClick={() => {
          let r = getRandomGreeting()
          while (r === currentGreeting) {
            r = getRandomGreeting()
          }
          setCurrentGreeting(r)
          op.track('click_random_greeting')
        }}
      >
        {currentGreeting}
      </span>
      ,{' '}
    </>
  )
}
