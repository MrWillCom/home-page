import styles from './page.module.scss'
import NavigatorSection from '@/components/NavigatorSection'
import TechShowcase from '@/components/TechShowcase'
import SocialMediaSection from '@/components/SocialMediaSection'
import UnsplashSection from '@/components/UnsplashSection'
import MessageSection from '@/components/MessageSection'
import ProjectShowcase from '@/components/ProjectShowcase'
import FeatureSupportSection from '@/components/FeatureSupportSection'
import TimeSection from '@/components/TimeSection'
import AnimeShowcase from '@/components/AnimeShowcase'
import ReneurPromotion from '@/components/ReneurPromotion'
import ChristmasGreeting from '@/components/ChristmasGreeting'
import HeroSection from '@/components/HeroSection'

export default async function Home() {
  return (
    <>
      <main className={styles.main}>
        <HeroSection />
        <ChristmasGreeting />
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
    </>
  )
}
