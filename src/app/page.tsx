import RandomGreeting from '@/components/RandomGreeting'
import styles from './page.module.scss'
import NavigatorSection from '@/components/NavigatorSection'
import TechShowcase from '@/components/TechShowcase'
import SocialMediaSection from '@/components/SocialMediaSection'
import UnsplashSection from '@/components/UnsplashSection'
import MessageSection from '@/components/MessageSection'
import Image from 'next/image'
import AvatarImage from '@/assets/avatar.jpg'
import ProjectShowcase from '@/components/ProjectShowcase'
import FeatureSupportSection from '@/components/FeatureSupportSection'

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.left}>
          <h1 className={styles.greeting}>
            <RandomGreeting />
            I'm&nbsp;<strong>Mr.&nbsp;Will</strong>!
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
      <SocialMediaSection />
      <NavigatorSection />
      <TechShowcase />
      <UnsplashSection />
      <ProjectShowcase />
      <MessageSection />
      <FeatureSupportSection />
      <footer className={styles.footer}>
        © 2021–{new Date().getFullYear()} Mr. Will (MrWillCom)
      </footer>
    </main>
  )
}
