import { useCallback, useEffect, useState } from 'react'
import { ApiError, fetchMountains, isAbortError } from '../api/weather.ts'
import type { LoadState, MountainFilters } from '../types.ts'

/**
 * Загружает вершины с погодой при каждом изменении фильтров.
 * Новый запрос отменяет предыдущий (AbortController), поэтому старые ответы
 * не перетирают новые. `reload()` повторяет запрос с теми же фильтрами.
 */
export function useMountains({ query, category }: MountainFilters) {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setState({ status: 'loading' })

    fetchMountains({ query, category }, controller.signal)
      .then((mountains) => {
        if (controller.signal.aborted) return
        setState(mountains.length ? { status: 'ready', mountains } : { status: 'empty' })
      })
      .catch((error: unknown) => {
        if (isAbortError(error) || controller.signal.aborted) return
        console.error(error)
        setState({ status: 'error', message: getErrorMessage(error) })
      })

    return () => controller.abort()
  }, [query, category, attempt])

  const reload = useCallback(() => setAttempt((n) => n + 1), [])

  return { state, reload, isLoading: state.status === 'loading' }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  return 'Произошла непредвиденная ошибка. Попробуйте ещё раз.'
}
