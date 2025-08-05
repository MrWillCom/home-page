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

const getRandomGreeting = () => greetings[_.random(greetings.length - 1)]

export default function RandomGreeting() {
  const [currentGreeting, setCurrentGreeting] = useState(getRandomGreeting())

  return (
    <>
      <span
        onClick={() => {
          setCurrentGreeting(getRandomGreeting())
        }}
      >
        {currentGreeting}
      </span>
      ,{' '}
    </>
  )
}
