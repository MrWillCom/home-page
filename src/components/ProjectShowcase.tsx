import styles from './ProjectShowcase.module.scss'
import type { ReactNode } from 'react'
import VisuallyHidden from './VisuallyHidden'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import hexoThemeCupertinoImage from '@/assets/hexo-theme-cupertino.webp'
import nextMastodonGalleryImage from '@/assets/next-mastodon-gallery.png'

function ProjectCard({
  title,
  description,
  techs,
  stats,
  links,
  image,
}: {
  title: ReactNode
  description: ReactNode
  techs: Array<string>
  stats: Array<{ key: ReactNode; value: ReactNode }>
  links: Array<ReactNode>
  image: ReactNode
}) {
  return (
    <article className={styles.projectCard}>
      <div className={styles.left}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <ul className={styles.techs}>
          {...techs.map(t => (
            <li>
              <i className={'si si-' + t} title={t} />
            </li>
          ))}
        </ul>
        <dl className={styles.stats}>
          {...stats.map(s => (
            <div className={styles.dlItem}>
              <dt>{s.key}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
        <ul className={styles.links}>{...links.map(l => <li>{l}</li>)}</ul>
      </div>
      <div className={styles.right}>
        <div className={styles.imageContainer}>{image}</div>
      </div>
    </article>
  )
}

async function fetchGitHubStars(repo: string) {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`)
    }

    const data = await response.json()
    return data.stargazers_count.toString()
  } catch (error) {
    console.error(error)
    return '-'
  }
}

async function fetchLastCommitDate(repo: string) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/commits?per_page=1`,
      { next: { revalidate: 3600 } },
    )

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`)
    }

    const data = await response.json()
    if (data && data.length > 0 && data[0].commit.committer.date) {
      return new Date(data[0].commit.committer.date)
    }
    return new Date(0)
  } catch (error) {
    console.error(error)
    return new Date(0)
  }
}

async function fetchFirstCommitDate(repo: string) {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`)
    }

    const data = await response.json()
    if (data.created_at) {
      return new Date(data.created_at)
    }
    return new Date(0)
  } catch (error) {
    console.error(error)
    return new Date(0)
  }
}

export default async function ProjectShowcase() {
  return (
    <section className={styles.sect}>
      <VisuallyHidden>
        <h2>Projects</h2>
      </VisuallyHidden>
      <ProjectCard
        title="Hexo Theme Cupertino"
        description="A modern and elegant theme for Hexo blogs, which is beautifully designed and has gorgeous details."
        techs={['hexo', 'ejs', 'sass', 'css']}
        stats={[
          {
            key: 'Stars',
            value: await fetchGitHubStars('MrWillCom/hexo-theme-cupertino'),
          },
          {
            key: 'Last updated',
            value: formatDistanceToNow(
              await fetchLastCommitDate('MrWillCom/hexo-theme-cupertino'),
              { addSuffix: true },
            ),
          },
          {
            key: 'Age',
            value: formatDistanceToNow(
              await fetchFirstCommitDate('MrWillCom/hexo-theme-cupertino'),
            ),
          },
        ]}
        links={[
          <a href="https://cupertino.mrwillcom.com/" target="_blank">
            Docs
          </a>,
          <a
            href="https://github.com/MrWillCom/hexo-theme-cupertino"
            target="_blank"
          >
            GitHub
          </a>,
          <a href="https://npmx.dev/hexo-theme-cupertino" target="_blank">
            npm
          </a>,
        ]}
        image={
          <Image
            src={hexoThemeCupertinoImage}
            alt="Screenshot of Hexo Theme Cupertino"
            width={1152}
            height={648}
            placeholder="blur"
          />
        }
      />
      <ProjectCard
        title="Next Mastodon Gallery"
        description="A Next.js-powered gallery for Mastodon."
        techs={['nextdotjs', 'sass', 'swr']}
        stats={[
          {
            key: 'Stars',
            value: await fetchGitHubStars('MrWillCom/next-mastodon-gallery'),
          },
          {
            key: 'Last updated',
            value: formatDistanceToNow(
              await fetchLastCommitDate('MrWillCom/next-mastodon-gallery'),
              { addSuffix: true },
            ),
          },
          {
            key: 'Age',
            value: formatDistanceToNow(
              await fetchFirstCommitDate('MrWillCom/next-mastodon-gallery'),
            ),
          },
        ]}
        links={[
          <a href="https://gallery.mrwillcom.com/" target="_blank">
            Preview
          </a>,
          <a
            href="https://github.com/MrWillCom/next-mastodon-gallery"
            target="_blank"
          >
            GitHub
          </a>,
        ]}
        image={
          <Image
            src={nextMastodonGalleryImage}
            alt="Screenshot of Next Mastodon Gallery"
            placeholder="blur"
          />
        }
      />
    </section>
  )
}
