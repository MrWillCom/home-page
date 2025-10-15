import styles from './TextBanner.module.scss'

// this is a temporary banner for Reneur's waitlist

export default function TextBanner() {
  return (
    <section className={styles.sect}>
      <p>
        <strong>Reneur</strong> is a new personal links page.
      </p>
      <p>
        Unlike Linktree or Bio Link, it's <strong>compact</strong> and{' '}
        <strong>efficient</strong>, which is so suitable{' '}
        <i>
          <strong>for developers</strong>
        </i>
        .
      </p>
      <p>
        To be the first to know when it launches,{' '}
        <a href="https://accounts.reneur.link/waitlist" target="_blank">
          join the waitlist
        </a>
        .
      </p>
    </section>
  )
}
