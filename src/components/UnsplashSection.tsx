import styles from './UnsplashSection.module.scss'
import AtroposWrapper from './AtroposWrapper'

function AtroposImage({ src, alt }: { src: string; alt?: string }) {
  return (
    <AtroposWrapper shadowScale={0.8}>
      <img src={src} alt={alt} className={styles.atroposImage} />
    </AtroposWrapper>
  )
}

export default async function UnsplashSection() {
  var photos = null

  try {
    const data = await fetch(
      'https://api.unsplash.com/users/mrwillcom/photos?per_page=3',
      {
        headers: {
          Authorization: 'Client-ID ' + process.env.UNSPLASH_ACCESS_KEY,
        },
      },
    )
    photos = await data.json()
  } catch (error) {
    console.error(error)
  }

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
        {...(() => {
          try {
            return photos.map(
              (p: { urls: { regular: string }; alt_description: string }) => (
                <AtroposImage src={p.urls.regular} alt={p.alt_description} />
              ),
            )
          } catch (error) {
            console.error(error)

            return [null]
          }
        })()}
      </div>
    </section>
  )
}
