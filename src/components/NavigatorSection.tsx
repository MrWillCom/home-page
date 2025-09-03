'use client'

import { useState } from 'react'
import styles from './NavigatorSection.module.scss'
import { useOpenPanel } from '@openpanel/nextjs'

const subdomains = [
  {
    title: 'Blog',
    name: 'blog',
    description: 'My blog.',
  },
  {
    title: 'Hexo Theme Cupertino Docs',
    name: 'cupertino',
    description: 'Docs for Hexo Theme Cupertino.',
  },
  {
    title: 'Gallery',
    name: 'gallery',
    description: 'A Next.js powered gallery for Mastodon.',
  },
  {
    title: 'aka',
    name: 'aka',
    description: 'A tiny redirector for shortening links.',
  },
  {
    title: 'TurbulentFlux',
    name: 'tblf',
    description:
      'Generate dynamic glow spots in a certain area and update them consistently.',
  },
  {
    title: 'www',
    name: 'www',
    description: '(Same as `mrwillcom.com`)',
  },
  {
    title: 'Phanpy',
    name: 'phanpy',
    description:
      '[Self-hosted] A minimalistic opinionated Mastodon web client.', // TODO: Make a tag for `[Self-hosted]`
  },
  {
    title: 'Moodist',
    name: 'moodist',
    description: '[Self-hosted] Ambient sounds for focus and calm.',
  },
]

export default function NavigatorSection() {
  const [inputValue, setInputValue] = useState('')
  const op = useOpenPanel()

  const foundSubdomains = subdomains.filter(s => {
    if (inputValue === '') {
      return true
    } else if (
      s.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1 ||
      s.title.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1 ||
      s.description.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
    ) {
      return true
    } else {
      return false
    }
  })

  return (
    <section className={styles.navigator}>
      <div
        className={
          styles.typingArea +
          (foundSubdomains.length === 1 ? ' ' + styles.ready : '')
        }
      >
        <input
          type="text"
          placeholder="Jump to ..."
          value={inputValue}
          onChange={ev => {
            setInputValue(ev.target.value)
          }}
          onKeyDown={ev => {
            if (ev.key === 'Enter' && ev.currentTarget.value.length > 0) {
              const subdomain =
                foundSubdomains.length === 1
                  ? foundSubdomains[0].name
                  : ev.currentTarget.value
              window.open('https://' + subdomain + '.mrwillcom.com')
              op.track('navigator_jump_to', { subdomain })
            }
          }}
        />
        <span>.mrwillcom.com</span>
      </div>
      <div className={styles.subdomains}>
        <ul>
          {...foundSubdomains.map((s, i) => (
            <li
              className={
                foundSubdomains.length === 1 && i === 0 ? styles.active : ''
              }
            >
              <a href={'https://' + s.name + '.mrwillcom.com/'} target="_blank">
                <span className={styles.left}>
                  <span className={styles.title}>{s.title}</span>
                  <span className={styles.description}> {s.description}</span>
                </span>
                <span className={styles.right}>
                  <span className={styles.name}>{s.name}</span>.
                  <span className={styles.domainName}>mrwillcom.com</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
