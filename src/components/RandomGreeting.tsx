'use client'

import _ from 'lodash'
import { useState } from 'react'

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

  return (
    <>
      <span
        onClick={() => {
          let r = getRandomGreeting()
          while (r === currentGreeting) {
            r = getRandomGreeting()
          }
          setCurrentGreeting(getRandomGreeting())
        }}
        suppressHydrationWarning
      >
        {currentGreeting}
      </span>
      ,{' '}
    </>
  )
}
