'use client'

import _ from 'lodash'

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

export default function RandomGreeting() {
  return greetings[_.random(greetings.length - 1)] + ', '
}
