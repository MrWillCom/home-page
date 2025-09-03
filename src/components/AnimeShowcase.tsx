import styles from './AnimeShowcase.module.scss'
import * as dateFns from 'date-fns'
import { TZDate } from '@date-fns/tz'
import { TIMEZONE } from './TimeSection'

export default async function AnimeShowcase() {
  var animeEntries = null

  try {
    const userId = '6112486'

    const query = `
{
  MediaListCollection(
    userId: ${userId}
    type: ANIME
    status: COMPLETED
    sort: [FINISHED_ON_DESC]
  ) {
    lists {
      entries {
        completedAt {
          year
          month
          day
        }
        media {
          title {
            native
          }
          description
          siteUrl
          startDate {
            year
          }
          coverImage {
            color
            medium
          }
        }
      }
    }
  }
}
`

    const data = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 },
    })

    animeEntries = (await data.json())?.data?.MediaListCollection?.lists?.[0]
      ?.entries
  } catch (error) {
    console.error(error)
  }

  return (
    <section className={styles.sect}>
      <h2 className={styles.sectionTitle}>Watched Anime</h2>
      <div className={styles.list}>
        <ul>
          {...animeEntries?.map(
            (e: {
              completedAt: {
                year: number
                month: number
                day: number
              }
              media: {
                title: {
                  native: string
                }
                description: string
                siteUrl: string

                startDate: {
                  year: number
                }
                coverImage: {
                  color?: string
                  medium: string
                }
              }
            }) => (
              <li
                style={
                  {
                    '--cover-color':
                      e.media.coverImage.color ??
                      'var(--background-color-secondary)',
                  } as React.CSSProperties
                }
              >
                <a href={e.media.siteUrl} target="_blank">
                  <img
                    src={e.media.coverImage.medium}
                    alt={`Cover image of ${e.media.title}.`}
                    loading="lazy"
                    className={styles.cover}
                  />
                  <div className={styles.info}>
                    <h3 className={styles.title}>{e.media.title.native}</h3>
                    <p
                      className={styles.description}
                      dangerouslySetInnerHTML={{ __html: e.media.description }}
                    />
                    <dl className={styles.dl}>
                      <div>
                        <dt>Released in</dt>
                        <dd>{e.media.startDate.year}</dd>
                      </div>
                      <div>
                        <dt>Completed watching</dt>
                        <dd>
                          {dateFns.formatDistanceToNow(
                            dateFns.set(new TZDate(new Date(), TIMEZONE), {
                              year: e.completedAt.year,
                              month: e.completedAt.month - 1,
                              date: e.completedAt.day,
                              hours: 0,
                              minutes: 0,
                              seconds: 0,
                              milliseconds: 0,
                            }),
                            { addSuffix: true },
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </a>
              </li>
            ),
          ) ?? []}
        </ul>
      </div>
    </section>
  )
}
