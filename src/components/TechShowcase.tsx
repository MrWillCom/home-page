'use client'

import styles from './TechShowcase.module.scss'
import { useEffect, useRef } from 'react'
import _ from 'lodash'
import { atom, useAtom } from 'jotai'

const techs = [
  'react',
  'postgresql',
  'vite',
  'prisma',
  'nextdotjs',
  'sass',
  'drizzle',
  'css',
  'vercel',
  'github',
  'nextra',
  'javascript',
  'npm',
  'cloudflare',
  'git',
  'spaceship',
  'tower',
  'zsh',
  'starship',
  'zedindustries',
  'normalizedotcss',
  'zod',
  'googlechrome',
  'hexo',
  'ejs',
  'nunjucks',
  'hono',
  'figma',
  'unsplash',
  'html5',
  'eleventy',
  'resend',
  'nodedotjs',
  'pnpm',
  'prettier',
  'markdown',
  'jamstack',
  'typescript',
]

const SHOWN_COUNT = 12

const currentTechsAtom = atom(_.sampleSize(techs, SHOWN_COUNT))

function TechIcon({ i }: { i: number }) {
  const [currentTechs, setCurrentTechs] = useAtom(currentTechsAtom)

  return (
    <div className={styles.techIcon}>
      <i className={'si si-' + currentTechs[i]} suppressHydrationWarning />
    </div>
  )
}

export default function TechShowcase() {
  const [currentTechs, setCurrentTechs] = useAtom(currentTechsAtom)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (gridRef.current) {
        gridRef.current.setAttribute('data-hidden', '')

        const handler = () => {
          setCurrentTechs(_.sampleSize(techs, SHOWN_COUNT))
          if (gridRef.current) {
            gridRef.current.removeAttribute('data-hidden')
            gridRef.current.removeEventListener('transitionend', handler)
          }
        }

        gridRef.current.addEventListener('transitionend', handler)
      }
    }, 3600)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <section>
      <h2 className={styles.heading}>
        I work with <i>countless</i> technologies, services and software.
      </h2>
      <div className={styles.grid} ref={gridRef}>
        {..._.range(SHOWN_COUNT).map(i => <TechIcon i={i} />)}
      </div>
    </section>
  )
}
