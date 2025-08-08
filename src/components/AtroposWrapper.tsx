'use client'

import Atropos from 'atropos/react'
import { ComponentProps } from 'react'

export default function AtroposWrapper(props: ComponentProps<typeof Atropos>) {
  return <Atropos {...props} />
}
