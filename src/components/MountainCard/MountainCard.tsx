import { useMemo } from 'react'
import type { MountainWithWeather } from '../../types.ts'
import { formatNumber, formatTemp } from '../../utils/format.ts'
import { ridgePaths } from '../../utils/ridge.ts'
import { skyType, tempTone } from '../../utils/weatherCodes.ts'
import styles from './MountainCard.module.css'

interface MountainCardProps {
  mountain: MountainWithWeather
}

interface StatProps {
  term: string
  value: string
  hint?: string
}

function Stat({ term, value, hint }: StatProps) {
  return (
    <div className={styles.stat}>
      <dt className={styles.statTerm}>{term}</dt>
      <dd className={styles.statValue}>{value}{hint && <small className={styles.statHint}>{hint}</small>}</dd>
    </div>
  )
}

export function MountainCard({ mountain }: MountainCardProps) {
  const { weather } = mountain
  const ridge = useMemo(() => ridgePaths(mountain.id, mountain.elevation), [mountain.id, mountain.elevation])
  const mediaClass = [styles.media, styles[skyType(weather.code)], !weather.isDay && styles.night].filter(Boolean).join(' ')
  const tempClass = [styles.temp, styles[tempTone(weather.temperature)]].filter(Boolean).join(' ')

  return (
    <article className={styles.card} data-id={mountain.id}>
      <div className={mediaClass}>
        <svg className={styles.ridge} viewBox="0 0 300 140" preserveAspectRatio="none" aria-hidden="true">
          <path className={styles.ridgeBack} d={ridge.back} />
          <path className={styles.ridgeFront} d={ridge.front} />
          <path className={styles.ridgeSnow} d={ridge.snow} />
        </svg>
        <span className={styles.chip}>{mountain.rangeName}</span>
        <span className={styles.elevation}>{formatNumber(mountain.elevation)} м</span>
        <span className={styles.weatherIcon} aria-hidden="true">{weather.icon}</span>
      </div>
      <div className={styles.body}>
        <h2 className={styles.title}>{mountain.name}</h2>
        <p className={styles.country}>{mountain.country}</p>
        <div className={tempClass}>
          <span className={styles.tempValue}>{formatTemp(weather.temperature)}</span>
          <div className={styles.tempMeta}>
            <span className={styles.tempText}>{weather.text}</span>
            <span className={styles.tempFeels}>ощущается как {formatTemp(weather.feelsLike)}</span>
          </div>
        </div>
        <dl className={styles.stats}>
          <Stat term="Ветер" value={`${weather.windSpeed} км/ч`} hint={`порывы до ${weather.windGusts}`} />
          <Stat term="Облачность" value={`${weather.cloudCover} %`} />
          <Stat term="Местное время" value={weather.localTime} hint={weather.isDay ? 'день' : 'ночь'} />
        </dl>
      </div>
    </article>
  )
}
