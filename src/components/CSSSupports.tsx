'use client'

import styles from './CSSSupports.module.scss'
import { useEffect, useState } from 'react'

export default function CSSSupports({ condition }: { condition: string }) {
  const [supports, setSupports] = useState<boolean | null>(null)

  useEffect(() => {
    setSupports(CSS.supports(condition))
  }, [])

  return supports === null ? (
    <span className={styles.unknown}>Unknown</span>
  ) : supports ? (
    <span className={styles.yes}>Supports</span>
  ) : (
    <span className={styles.no}>Doesn't support</span>
  )
}
