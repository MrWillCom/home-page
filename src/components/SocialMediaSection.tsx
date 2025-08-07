import styles from './SocialMediaSection.module.scss'

export default function SocialMediaSection() {
  return (
    <section className={styles.grid}>
      <a href="https://github.com/MrWillCom" target="_blank">
        GitHub
      </a>
      <a href="https://noc.social/@MrWillCom" target="_blank">
        Mastodon
      </a>
      <a href="mailto:hi@mrwillcom.com">Email</a>
      <a href="https://unsplash.com/@mrwillcom" target="_blank">
        Unsplash
      </a>
    </section>
  )
}
