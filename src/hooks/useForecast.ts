import { useCallback, useEffect, useState } from 'react'
import { fetchForecast } from '../api/forecast.ts'
import { ApiError, isAbortError } from '../api/http.ts'
import type { ForecastDay, Mountain } from '../types.ts'

export type ForecastState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; days: ForecastDay[] }

/** Прогноз на 7 дней для вершины; при смене вершины или закрытии окна запрос отменяется. */
export function useForecast(mountain: Mountain) {
  const [state, setState] = useState<ForecastState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setState({ status: 'loading' })

    fetchForecast(mountain, controller.signal)
      .then((days) => {
        if (!controller.signal.aborted) setState({ status: 'ready', days })
      })
      .catch((error: unknown) => {
        if (isAbortError(error) || controller.signal.aborted) return
        const message = error instanceof ApiError ? error.message : 'Проверьте подключение к интернету.'
        setState({ status: 'error', message })
      })

    return () => controller.abort()
  }, [mountain, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  return { state, retry }
}
