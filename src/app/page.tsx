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
import TimeSection from '@/components/TimeSection'
import AnimeShowcase from '@/components/AnimeShowcase'
import ReneurPromotion from '@/components/ReneurPromotion'
import Snowy from '@/components/Snowy'

export default function Home() {
  return (
    <>
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
        <ReneurPromotion />
        <TimeSection />
        <NavigatorSection />
        <TechShowcase />
        <UnsplashSection />
        <ProjectShowcase />
        <AnimeShowcase />
        <MessageSection />
        <FeatureSupportSection />
        <footer className={styles.footer}>
          <p className={styles.attribution}>
            <a href="https://sunrise-sunset.org/api">
              Sunrise-Sunset (sunrise-sunset.org/api)
            </a>{' '}
            is used for sunrise and sunset data.
          </p>
          <p className={styles.copyright}>
            © 2021–{new Date().getFullYear()} Mr. Will (MrWillCom)
          </p>
        </footer>
      </main>
      <Snowy />
    </>
  )
}
