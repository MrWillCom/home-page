import RandomGreeting from '@/components/RandomGreeting'
import styles from './HeroSection.module.scss'
import Image from 'next/image'
import AvatarImage from '@/assets/avatar.jpg'
import { unstable_cache } from 'next/cache'
import _ from 'lodash'
import { getRandomGreeting } from '@/data/greetings'

const getTimeBasedGreeting = unstable_cache(
  async () => {
    return getRandomGreeting()
  },
  ['random-greeting'],
  { revalidate: 60 },
)

export default async function HeroSection() {
  const initialGreeting = await getTimeBasedGreeting()

  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <h1 className={styles.greeting}>
          <RandomGreeting initial={initialGreeting} />
          I&apos;m&nbsp;<strong>Mr.&nbsp;Will</strong>!
        </h1>
        <p className={styles.description}>
          A <i>full-stack developer</i> and a <i>photographer</i>.
        </p>
      </div>
      <div className={styles.right}>
        <Image
          src={AvatarImage}
          alt="Avatar"
          width={160}
          height={160}
          placeholder="blur"
          className={styles.avatar}
        />
      </div>
    </section>
  )
}
