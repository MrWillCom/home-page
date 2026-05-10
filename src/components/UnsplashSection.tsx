import styles from './UnsplashSection.module.scss'
import AtroposWrapper from './AtroposWrapper'
import UnsplashStats from './UnsplashStats'
import { ImgHTMLAttributes } from 'react'

function AtroposImage({ className, ...props }: ImgHTMLAttributes<HTMLElement>) {
  return (
    <AtroposWrapper shadow={false} activeOffset={25}>
      <img className={styles.atroposImage + (className ? ' ' + className : '')} {...props} />
    </AtroposWrapper>
  )
}

export default async function UnsplashSection() {
  var photos = null
  var statistics = null

  try {
    const data = await fetch('https://api.unsplash.com/users/mrwillcom/photos?per_page=3', {
      headers: {
        Authorization: 'Client-ID ' + process.env.UNSPLASH_ACCESS_KEY,
      },
      next: { revalidate: 3600 },
    })
    photos = await data.json()
  } catch (error) {
    console.error(error)
  }

  try {
    const data = await fetch('https://api.unsplash.com/users/mrwillcom/statistics', {
      headers: {
        Authorization: 'Client-ID ' + process.env.UNSPLASH_ACCESS_KEY,
      },
      next: {
        revalidate: 21600, // 6 hrs
      },
    })

    interface StatisticItem {
      total: number
      historical: {
        change: number
        average: number
        resolution: string
        quantity: number
        values: {
          date: string
          value: number
        }[]
      }
    }

    statistics = (await data.json()) as { downloads: StatisticItem; views: StatisticItem }
  } catch (error) {
    console.error(error)
  }

  const TIME_SPAN = 30 * 24 * 60 * 60 * 1000
  const viewsInterval = statistics ? TIME_SPAN / statistics.views.historical.change : 0
  const downloadsInterval = statistics ? TIME_SPAN / statistics.downloads.historical.change : 0

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
        {statistics && (
          <div className={styles.statistics}>
            <span className={styles.lastNDays}>Last 30 days</span>
            <UnsplashStats
              initialViews={statistics.views.historical.change}
              initialDownloads={statistics.downloads.historical.change}
              viewsInterval={viewsInterval}
              downloadsInterval={downloadsInterval}
            />
          </div>
        )}
        <a href="https://unsplash.com/@mrwillcom" target="_blank" className={styles.bottom}>
          <span>View Profile</span>
          <strong>@mrwillcom</strong>
        </a>
      </div>
      <div className={styles.images}>
        {...(() => {
          try {
            return photos.map((p: { urls: { regular: string }; alt_description: string }) => (
              <AtroposImage
                src={p.urls.regular}
                alt={p.alt_description ?? 'One of my Unsplash photos.'}
                loading="lazy"
              />
            ))
          } catch (error) {
            console.error(error)

            return [
              <span className={styles.error}>
                Oops, something went wrong. Here should be some photos. I'd appreciate you very much
                if you're willing to <a href="mailto:hi@mrwillcom.com">report this issue to me</a>.
              </span>,
            ]
          }
        })()}
        <div className={styles.mask}>
          <AtroposWrapper highlight={false} activeOffset={75}>
            <a href="https://unsplash.com/@mrwillcom" target="_blank">
              View more
            </a>
          </AtroposWrapper>
        </div>
      </div>
    </section>
  )
}
