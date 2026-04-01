'use client'

import styles from './TechShowcase.module.scss'
import { useEffect, useRef } from 'react'
import _ from 'lodash'
import { atom, useAtom } from 'jotai'
import { AnimatePresence, motion } from 'motion/react'

const techs = [
  'clerk',
  'cloudflare',
  'codemirror',
  'css',
  'docker',
  'dotenv',
  'drizzle',
  'ejs',
  'eleventy',
  'figma',
  'git',
  'github',
  'googlechrome',
  'hexo',
  'hono',
  'html5',
  'jamstack',
  'javascript',
  'lodash',
  'lucide',
  'markdown',
  'nextdotjs',
  'nextra',
  'nodedotjs',
  'normalizedotcss',
  'npm',
  'nunjucks',
  'pnpm',
  'postgresql',
  'prettier',
  'prisma',
  'radixui',
  'react',
  'resend',
  'sass',
  'spaceship',
  'starship',
  'tower',
  'typescript',
  'unsplash',
  'vercel',
  'vite',
  'zedindustries',
  'zod',
  'zsh',
]

const SHOWN_COUNT = 12

const currentTechsAtom = atom(_.sampleSize(techs, SHOWN_COUNT))

function TechIcon({ i, tech }: { i: number; tech: string }) {
  return (
    <div className={styles.techIcon}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.i
          key={`${i}-${tech}`}
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(2px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.9, filter: 'blur(2px)' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={'si si-' + tech}
          suppressHydrationWarning
        />
      </AnimatePresence>
    </div>
  )
}

export default function TechShowcase() {
  const [currentTechs, setCurrentTechs] = useAtom(currentTechsAtom)
  const lastIndex = useRef<number | null>(null)

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!document.hidden) {
        setCurrentTechs(prev => {
          let index = _.random(0, SHOWN_COUNT - 1)
          while (index === lastIndex.current) {
            index = _.random(0, SHOWN_COUNT - 1)
          }
          lastIndex.current = index

          return Object.values({
            ...prev,
            [index]: _.sample(_.difference(techs, prev)),
          }) as string[]
        })
      }
    }, 2000)

    return () => {
      clearInterval(intervalId)
    }
  }, [setCurrentTechs])

  return (
    <section>
      <h2 className={styles.heading}>
        I work with <i>countless</i> technologies, services and software.
      </h2>
      <div className={styles.grid}>
        {..._.range(SHOWN_COUNT).map(i => <TechIcon i={i} tech={currentTechs[i]} />)}
      </div>
    </section>
  )
}
