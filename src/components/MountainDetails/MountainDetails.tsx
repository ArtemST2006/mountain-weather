import { useEffect, useId, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { useForecast } from '../../hooks/useForecast.ts'
import { useMountainPhoto } from '../../hooks/useMountainPhoto.ts'
import type { MountainWithWeather } from '../../types.ts'
import { formatNumber, formatTemp } from '../../utils/format.ts'
import { Button } from '../Button/Button.tsx'
import { Forecast } from './Forecast.tsx'
import styles from './MountainDetails.module.css'

interface MountainDetailsProps {
  mountain: MountainWithWeather
  /** окно закрыто (крестик, Esc или клик по фону) */
  onClose: () => void
}

/**
 * Модальное окно вершины: фото, факты, текущая погода и прогноз на 7 дней.
 * Нативный <dialog> сам держит фокус внутри, закрывается по Esc и возвращает фокус
 * на карточку, с которой его открыли.
 */
export function MountainDetails({ mountain, onClose }: MountainDetailsProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const { state: forecast, retry } = useForecast(mountain)
  const photo = useMountainPhoto(mountain.wiki)
  const [photoFailed, setPhotoFailed] = useState(false)
  const photoUrl = photoFailed ? undefined : (photo?.original ?? photo?.thumbnail)
  const { weather } = mountain

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!dialog.open) dialog.showModal()
    return () => {
      if (dialog.open) dialog.close()
    }
  }, [])

  // Событие close приходит асинхронно; если окно уже снова открыто (StrictMode) — игнорируем
  const handleClose = () => {
    if (!dialogRef.current?.open) onClose()
  }

  // Клик по затемнённому фону вокруг окна
  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    const dialog = event.currentTarget
    if (event.target !== dialog) return
    const rect = dialog.getBoundingClientRect()
    const outside =
      event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom
    if (outside) dialog.close()
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClose={handleClose}
      onClick={handleBackdropClick}
    >
      <div className={styles.hero}>
        {photoUrl && (
          <img
            className={styles.photo}
            src={photoUrl}
            alt={`Вершина ${mountain.name}`}
            onError={() => setPhotoFailed(true)}
          />
        )}
        <button
          type="button"
          className={styles.close}
          aria-label="Закрыть подробности"
          onClick={() => dialogRef.current?.close()}
        >
          ×
        </button>
      </div>

      <div className={styles.info}>
        <h2 id={titleId} className={styles.title}>
          {mountain.name}
        </h2>
        <p className={styles.muted}>
          {mountain.rangeName} · {mountain.country} · {formatNumber(mountain.elevation)} м
        </p>
        <p className={styles.muted}>
          Координаты: {mountain.lat.toFixed(4)}, {mountain.lon.toFixed(4)}
        </p>
        <p className={styles.current}>
          {weather.icon} Сейчас {weather.text.toLowerCase()}, {formatTemp(weather.temperature)} · ветер{' '}
          {weather.windSpeed} км/ч
        </p>
        <a
          className={styles.link}
          href={`https://en.wikipedia.org/wiki/${encodeURIComponent(mountain.wiki)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Статья в Википедии
        </a>

        <h3 className={styles.sectionTitle}>Прогноз на 7 дней</h3>
        {forecast.status === 'loading' && <p className={styles.muted}>Загрузка прогноза…</p>}
        {forecast.status === 'error' && <ForecastError message={forecast.message} onRetry={retry} />}
        {forecast.status === 'ready' && <Forecast days={forecast.days} />}
      </div>
    </dialog>
  )
}

function ForecastError({ message, onRetry }: { message: string; onRetry: () => void }) {
  const retryRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    retryRef.current?.focus()
  }, [])

  return (
    <div className={styles.error} role="alert">
      <strong>Не удалось загрузить прогноз</strong>
      <p>{message}</p>
      <Button ref={retryRef} variant="primary" className={styles.retry} onClick={onRetry}>
        Повторить
      </Button>
    </div>
  )
}
