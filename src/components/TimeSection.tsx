import styles from './TimeSection.module.scss'
import Now from './Now'
import * as dateFns from 'date-fns'
import { TZDate } from '@date-fns/tz'

// `LAT` and `LNG` are never used for calculation, so it's safe to store them in strings.
const LAT = '31.2304'
const LNG = '121.4737'
const TIMEZONE = 'Asia/Shanghai'

export default async function TimeSection() {
  var sunriseSunsetData = null

  try {
    const data = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${LAT}&lng=${LNG}&formatted=0&tzid=${encodeURIComponent(TIMEZONE)}`,
      {
        next: { revalidate: 900 },
      },
    )
    sunriseSunsetData = (await data.json()).results
  } catch (error) {
    console.error(error)
  }

  return (
    <section className={styles.sect}>
      <div className={styles.card}>
        <div
          className={[
            'side',
            'left',
            (() => {
              let ssd = { ...sunriseSunsetData }
              const now = new Date()
              ssd['sunrise'] = new Date(sunriseSunsetData?.sunrise ?? 0)
              ssd['sunset'] = new Date(sunriseSunsetData?.sunset ?? 0)
              ssd['solar_noon'] = new Date(sunriseSunsetData?.solar_noon ?? 0)
              ssd['astronomical_twilight_end'] = new Date(
                sunriseSunsetData?.astronomical_twilight_end ?? 0,
              )

              if (
                dateFns.isAfter(now, dateFns.subHours(ssd.sunrise, 0.8)) &&
                dateFns.isBefore(now, dateFns.addHours(ssd.sunrise, 0.8))
              ) {
                return 'sunrise'
              } else if (
                dateFns.isAfter(now, dateFns.subHours(ssd.sunset, 0.8)) &&
                dateFns.isBefore(now, dateFns.addHours(ssd.sunset, 0.8))
              ) {
                return 'sunset'
              } else if (
                dateFns.isAfter(now, dateFns.addHours(ssd.sunrise, 0.8)) &&
                dateFns.isBefore(now, ssd.solar_noon)
              ) {
                return 'morning'
              } else if (
                dateFns.isAfter(now, ssd.solar_noon) &&
                dateFns.isBefore(now, dateFns.subHours(ssd.sunset, 0.8))
              ) {
                return 'noon'
              } else if (
                dateFns.isAfter(now, dateFns.addHours(ssd.sunset, 0.8)) &&
                dateFns.isBefore(now, ssd.astronomical_twilight_end)
              ) {
                return 'evening'
              } else if (
                dateFns.isAfter(
                  now,
                  dateFns.set(new TZDate(now, TIMEZONE), {
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    milliseconds: 0,
                  }),
                ) &&
                dateFns.isBefore(now, dateFns.subHours(ssd.sunrise, 0.8))
              ) {
                return 'midnight'
              } else if (
                dateFns.isAfter(now, ssd.astronomical_twilight_end) &&
                dateFns.isBefore(
                  now,
                  dateFns.addDays(
                    dateFns.set(new TZDate(now, TIMEZONE), {
                      hours: 0,
                      minutes: 0,
                      seconds: 0,
                      milliseconds: 0,
                    }),
                    1,
                  ),
                )
              ) {
                return 'night'
              }

              return 'noon'
            })(),
          ]
            .map(c => styles[c])
            .join(' ')}
        >
          <span className={styles.timezone}>
            <span>
              <span className={styles.continent}>{TIMEZONE.split('/')[0]}</span>{' '}
              <span className={styles.slash}>/</span>{' '}
              <span className={styles.city}>{TIMEZONE.split('/')[1]}</span>
            </span>
            <span className={styles.offset}>
              UTC
              {(function getUtcOffsetHours(timeZone) {
                const referenceDate = new Date(
                  Date.UTC(new Date().getFullYear(), 0, 1),
                )
                const utcDate = new Date(
                  referenceDate.toLocaleString('en-US', { timeZone: 'UTC' }),
                )
                const tzDate = new Date(
                  referenceDate.toLocaleString('en-US', { timeZone }),
                )
                const offsetHours = Math.trunc(
                  (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60),
                )
                const sign = offsetHours >= 0 ? '+' : '-'
                const absoluteHours = Math.abs(offsetHours)
                return offsetHours === 0 ? '' : `${sign}${absoluteHours}`
              })(TIMEZONE)}
            </span>
          </span>
          <span className={styles.time} suppressHydrationWarning>
            <Now timezone={TIMEZONE} />
          </span>
        </div>
        <div className={['side', 'right'].map(c => styles[c]).join(' ')}>
          <span className={styles.latLng}>
            <strong>{LAT}</strong>°&nbsp;N
            <span className={styles.comma}>,</span>
            <br className={styles.br} /> <strong>{LNG}</strong>°&nbsp;E
          </span>
          <dl className={styles.dl}>
            <div>
              <dt>Sunrise</dt>
              <dd>
                {dateFns.format(
                  new TZDate(sunriseSunsetData?.sunrise ?? 0, TIMEZONE),
                  'H:mm',
                )}
              </dd>
            </div>
            <div>
              <dt>Sunset</dt>
              <dd>
                {dateFns.format(
                  new TZDate(sunriseSunsetData?.sunset ?? 0, TIMEZONE),
                  'H:mm',
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}

export { LAT, LNG, TIMEZONE }
