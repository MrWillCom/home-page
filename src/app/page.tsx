import RandomGreeting from '@/components/RandomGreeting'
import styles from './page.module.scss'
import NavigatorSection from '@/components/NavigatorSection'

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>
          <RandomGreeting />
          I'm <strong>Mr. Will</strong>!
        </h1>
        <p>
          A <i>full-stack developer</i> and a <i>photographer</i>.
        </p>
      </section>
      <NavigatorSection />
      <footer className={styles.footer}>
        © 2021-{new Date().getFullYear()} Mr. Will (MrWillCom)
      </footer>
    </main>
  )
}
