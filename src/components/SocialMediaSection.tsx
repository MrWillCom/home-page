import styles from './SocialMediaSection.module.scss'

async function HoverCard({
  altName,
  hideAvatar,
  hideHeader,
  displayName,
  username,
  icon,
}: {
  altName: string
  hideAvatar?: boolean
  hideHeader?: boolean
  displayName?: string
  username: string
  icon?: React.ReactNode
}) {
  const acctInfo = await (
    await fetch('https://vmst.io/api/v1/accounts/lookup?acct=MrWillCom', {
      next: { revalidate: 3600 },
    })
  ).json()

  return (
    <div className={styles.hoverCard}>
      {hideHeader === true ? (
        <div className={styles.icon}>{icon}</div>
      ) : (
        <img
          className={styles.headerImage}
          src={acctInfo.header}
          alt={`${altName} profile header`}
        />
      )}
      <div className={styles.content}>
        {hideAvatar === true ? null : (
          <img
            className={styles.avatar}
            src={acctInfo.avatar}
            alt={`${altName} avatar`}
          />
        )}
        <span className={styles.displayName}>
          {displayName || acctInfo.display_name}
        </span>
        <span className={styles.username}>{username}</span>
      </div>
    </div>
  )
}

export default async function SocialMediaSection() {
  return (
    <section className={styles.grid}>
      <a href="https://github.com/MrWillCom" target="_blank">
        <HoverCard
          altName="GitHub"
          hideHeader
          username="@MrWillCom"
          icon={<i className="si si-github" />}
        />
        <span className={styles.label}>GitHub</span>
      </a>
      <a href="mailto:hi@mrwillcom.com">
        <HoverCard
          altName="Email"
          hideAvatar
          hideHeader
          displayName="Domain Email"
          username="hi@mrwillcom.com"
          icon={<i className="si si-spaceship" />}
        />
        <span className={styles.label}>Email</span>
      </a>
      <a rel="me" href="https://vmst.io/@MrWillCom" target="_blank">
        <HoverCard altName="Mastodon" username="@MrWillCom@vmst.io" />
        <span className={styles.label}>Mastodon</span>
      </a>
      <a rel="me" href="https://x.com/MrWillCom" target="_blank">
        <HoverCard altName="X" username="@MrWillCom" />
        <span className={styles.label}>X</span>
      </a>
      <a rel="me" href="https://www.threads.com/@mr_will_com" target="_blank">
        <HoverCard
          altName="Threads"
          hideHeader
          username="@mr_will_com"
          icon={<i className="si si-threads" />}
        />
        <span className={styles.label}>Threads</span>
      </a>
      <a href="https://www.instagram.com/mr_will_com/" target="_blank">
        <HoverCard
          altName="Instagram"
          hideHeader
          username="@mr_will_com"
          icon={<i className="si si-instagram" />}
        />
        <span className={styles.label}>Instagram</span>
      </a>
    </section>
  )
}
