import styles from './SocialMediaSection.module.scss'

interface HoverCardProps {
  platform: string
  headerUrl?: string
  icon?: React.ReactNode
  avatarUrl?: string
  displayName: string
  username: string
  datalist?: { label: string; value: string }[]
}

function HoverCard({
  platform,
  headerUrl,
  icon,
  avatarUrl,
  displayName,
  username,
  datalist,
}: HoverCardProps) {
  return (
    <div className={styles.hoverCard}>
      {headerUrl && (
        <img
          className={styles.headerImage}
          src={headerUrl}
          alt={`${platform} profile header`}
        />
      )}
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.content}>
        {avatarUrl && (
          <img
            className={styles.avatar}
            src={avatarUrl}
            alt={`${platform} avatar`}
          />
        )}
        <span className={styles.displayName}>{displayName}</span>
        <span className={styles.username}>{username}</span>
        {datalist && (
          <dl className={styles.datalist}>
            {...datalist.map(({ label, value }) => (
              <div>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  )
}

export default async function SocialMediaSection() {
  const data: {
    url: string
    target?: React.HTMLAttributeAnchorTarget
    rel?: string
    label: string
    profile: HoverCardProps
  }[] = [
    {
      url: 'https://github.com/MrWillCom',
      target: '_blank',
      label: 'GitHub',
      profile: await (async () => {
        const response = await (
          await fetch('https://api.github.com/users/MrWillCom', {
            headers: {
              Accept: 'application/vnd.github+json',
              'X-GitHub-Api-Version': '2022-11-28',
            },
            next: { revalidate: 3600 },
          })
        ).json()

        return {
          platform: 'GitHub',
          icon: <i className="si si-github" />,
          avatarUrl: response.avatar_url,
          displayName: response.name,
          username: `@${response.login}`,
          datalist: [
            { label: 'Following', value: response.following },
            { label: 'Followers', value: response.followers },
            { label: 'Repos', value: response.public_repos },
          ],
        }
      })(),
    },
    {
      url: 'mailto:hi@mrwillcom.com',
      label: 'Email',
      profile: {
        platform: 'Email',
        icon: <i className="si si-spaceship" />,
        displayName: 'Domain Email',
        username: 'hi@mrwillcom.com',
      },
    },
    {
      url: 'https://vmst.io/@MrWillCom',
      target: '_blank',
      label: 'Mastodon',
      profile: await (async () => {
        const response = await (
          await fetch('https://vmst.io/api/v1/accounts/lookup?acct=MrWillCom', {
            next: { revalidate: 3600 },
          })
        ).json()

        return {
          platform: 'Mastodon',
          headerUrl: response.header,
          avatarUrl: response.avatar,
          displayName: response.display_name,
          username: `@${response.username}@${new URL(response.url).hostname}`,
          datalist: [
            { label: 'Following', value: response.following_count },
            { label: 'Followers', value: response.followers_count },
            { label: 'Posts', value: response.statuses_count },
          ],
        }
      })(),
    },
    {
      url: 'https://x.com/MrWillCom',
      target: '_blank',
      label: 'X',
      profile: {
        platform: 'X',
        icon: <i className="si si-x" />,
        displayName: 'Mr. Will',
        username: '@MrWillCom',
      },
    },
    {
      url: 'https://www.threads.com/@mr_will_com',
      target: '_blank',
      label: 'Threads',
      profile: {
        platform: 'Threads',
        icon: <i className="si si-threads" />,
        displayName: 'Mr. Will',
        username: '@mr_will_com',
      },
    },
    {
      url: 'https://www.instagram.com/mr_will_com/',
      target: '_blank',
      label: 'Instagram',
      profile: {
        platform: 'Instagram',
        icon: <i className="si si-instagram" />,
        displayName: 'Mr. Will',
        username: '@mr_will_com',
      },
    },
  ]

  return (
    <section className={styles.grid}>
      {...data.map(({ url, target, rel, profile, label }) => (
        <a href={url} target={target} rel={rel}>
          <HoverCard {...profile} />
          <span className={styles.label}>{label}</span>
        </a>
      ))}
    </section>
  )
}
