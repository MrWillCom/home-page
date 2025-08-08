import styles from './UnsplashSection.module.scss'
import AtroposWrapper from './AtroposWrapper'

function AtroposImage({ src }: { src: string }) {
  return (
    <AtroposWrapper shadowScale={0.8}>
      <img src={src} className={styles.atroposImage} />
    </AtroposWrapper>
  )
}

export default function UnsplashSection() {
  return (
    <section className={styles.sect}>
      <div className={styles.left}>
        <div className={styles.top}>
          <h2>
            On <strong>Unsplash</strong>
          </h2>
          <p>
            I share my photographs on&nbsp;Unsplash,
            <br />
            where permissive free photos live.
          </p>
        </div>
        <a href="https://unsplash.com/@mrwillcom" className={styles.bottom}>
          <span>View Profile</span>
          <strong>@mrwillcom</strong>
        </a>
      </div>
      <div className={styles.images}>
        <AtroposImage src="https://picsum.photos/seed/picsum/400/600" />
        <AtroposImage src="https://picsum.photos/seed/react/400/600" />
        <AtroposImage src="https://picsum.photos/seed/homepage/600/600" />
      </div>
    </section>
  )
}
