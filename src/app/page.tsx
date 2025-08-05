import styles from './page.module.scss'
import NavigatorSection from '@/components/NavigatorSection'
import _ from 'lodash'

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>
          {['Hello', 'Hi', 'Greetings'][_.random(2)]}, I'm{' '}
          <strong>Mr. Will</strong>!
        </h1>
        <p>
          A <i>full-stack developer</i> and a <i>photographer</i>.
        </p>
      </section>
      <NavigatorSection />
    </main>
  )
}
