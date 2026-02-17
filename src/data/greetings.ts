import _ from 'lodash'

export const greetings = [
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

export const getRandomGreeting = () => _.sample(greetings) as string
