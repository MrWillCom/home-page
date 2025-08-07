import styles from './SocialMediaSection.module.scss'

export default function SocialMediaSection() {
  return (
    <section className={styles.grid}>
      <a href="https://github.com/MrWillCom" target="_blank">
        <span>GitHub</span>
      </a>
      <a href="https://noc.social/@MrWillCom" target="_blank">
        <span>Mastodon</span>
      </a>
      <a href="mailto:hi@mrwillcom.com">
        <span>Email</span>
      </a>
      <a href="https://unsplash.com/@mrwillcom" target="_blank">
        <span>Unsplash</span>
      </a>
    </section>
  )
}
