import styles from './BlogPostsSection.module.scss'
import BlogPostHoverList from './BlogPostHoverList'
import { XMLParser } from 'fast-xml-parser'
import * as dateFns from 'date-fns'

// @_href and @_rel come from fast-xml-parser with attributeNamePrefix: '@_'
interface AtomLink {
  '@_href'?: string
  '@_rel'?: string
}

interface AtomEntry {
  title?: string
  link?: AtomLink | AtomLink[]
  published?: string
}

interface AtomFeed {
  feed?: {
    entry?: AtomEntry | AtomEntry[]
  }
}

function getLinkHref(link?: AtomLink | AtomLink[], rel?: string): string {
  if (!link) return ''
  const links = Array.isArray(link) ? link : [link]
  const target = rel ? links.find(l => l['@_rel'] === rel) : links[0]
  return target?.['@_href'] || ''
}

function formatPostDate(dateStr: string): string {
  const postDate = new Date(dateStr)
  const now = new Date()
  const diffDays = dateFns.differenceInDays(now, postDate)

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  const format = postDate.getFullYear() === now.getFullYear() ? 'MMM d' : 'MMM d, yyyy'
  return dateFns.format(postDate, format)
}

export default async function BlogPostsSection() {
  let posts: {
    title: string
    date: string
    permalink: string
    coverImage: string | undefined
    coverImageAlt: string
  }[] = []

  try {
    const response = await fetch('https://blog.mrwillcom.com/atom.xml', {
      next: { revalidate: 3600 * 6 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.status}`)
    }

    const xmlData = await response.text()

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    })

    const result = parser.parse(xmlData) as AtomFeed
    const entries = result.feed?.entry
    const entryArray = Array.isArray(entries) ? entries : entries ? [entries] : []

    posts = entryArray.slice(0, 3).map(entry => {
      const coverImage = getLinkHref(entry.link, 'enclosure')

      return {
        title: entry.title || '',
        date: formatPostDate(entry.published || ''),
        permalink: getLinkHref(entry.link),
        coverImage: coverImage || undefined,
        coverImageAlt: entry.title || '',
      }
    })
  } catch (error) {
    console.error('Failed to fetch blog posts:', error)
  }

  if (posts.length === 0) return null

  return (
    <section className={styles.sect}>
      <a href="https://blog.mrwillcom.com/" target="_blank" className={styles.header}>
        <h2 className={styles.heading}>Blog</h2>
        <span className={styles.arrow} />
      </a>
      <BlogPostHoverList posts={posts} />
    </section>
  )
}
