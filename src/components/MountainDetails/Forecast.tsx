import type { ForecastDay } from '../../types.ts'
import { formatTemp } from '../../utils/format.ts'
import styles from './Forecast.module.css'

const dateFormat = new Intl.DateTimeFormat('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' })
const snowFormat = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 })

interface ForecastProps {
  days: ForecastDay[]
}

/** Прогноз по дням с полосками температур на общей шкале недели. */
export function Forecast({ days }: ForecastProps) {
  const minimum = Math.floor(Math.min(...days.map((d) => d.min)))
  const span = Math.max(1, Math.ceil(Math.max(...days.map((d) => d.max))) - minimum)

  return (
    <div className={styles.list}>
      {days.map((day) => (
        <div key={day.date} className={styles.day}>
          {/* полдень, чтобы смена часового пояса не сдвинула дату */}
          <div className={styles.date}>{dateFormat.format(new Date(`${day.date}T12:00:00`))}</div>
          <div className={styles.conditions}>
            {day.icon} {day.text}
          </div>
          <div className={styles.temperatures}>
            {formatTemp(Math.round(day.min))} / {formatTemp(Math.round(day.max))}
          </div>
          <div className={styles.track}>
            {/* положение полоски зависит от данных — поэтому инлайн-стиль */}
            <span
              className={styles.bar}
              style={{
                left: `${((day.min - minimum) / span) * 100}%`,
                width: `${Math.max(2, ((day.max - day.min) / span) * 100)}%`,
              }}
            />
          </div>
          <div className={styles.extras}>
            Ветер {day.wind} км/ч · снег {snowFormat.format(day.snow)} см
          </div>
        </div>
      ))}
    </div>
  )
}
