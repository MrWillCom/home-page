'use client'

import _ from 'lodash'
import { useState } from 'react'
import { useOpenPanel } from '@openpanel/nextjs'

const greetings = [
  'Hello',
  'Hi',
  'Greetings',
  'Hi there',
  'Hello there',
  'Hey',
  'Howdy',
  'Good day',
  'Hola',
  'Bonjour',
  'Nice to see you',
  'Nice to meet you',
]

const getRandomGreeting = () => _.sample(greetings)

export default function RandomGreeting() {
  const [currentGreeting, setCurrentGreeting] = useState(getRandomGreeting())
  const op = useOpenPanel()

  return (
    <>
      <span
        onClick={() => {
          let r = getRandomGreeting()
          while (r === currentGreeting) {
            r = getRandomGreeting()
          }
          setCurrentGreeting(getRandomGreeting())
          op.track('click_random_greeting')
        }}
        suppressHydrationWarning
      >
        {currentGreeting}
      </span>
      ,{' '}
    </>
  )
}
