/**
 * Общий GET-запрос JSON с понятными ошибками.
 * Отладочный параметр адреса страницы ?delay=3000 добавляет паузу перед каждым запросом
 * к погоде (видно состояние «Загрузка…»).
 */

const DEBUG_DELAY = Number(new URLSearchParams(window.location.search).get('delay')) || 0

/** Ошибка, текст которой можно показать пользователю. */
export class ApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

/**
 * GET-запрос с проверкой response.ok.
 * fetch не отклоняет промис при 400/500 — поэтому статус проверяем сами.
 */
export async function requestJson<T>(url: URL, signal?: AbortSignal, { debugDelay = true } = {}): Promise<T> {
  let response: Response
  try {
    if (debugDelay && DEBUG_DELAY) await sleep(DEBUG_DELAY, signal)
    response = await fetch(url, { signal })
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new ApiError('Не удалось связаться с сервером погоды. Проверьте подключение к интернету.')
  }

  if (!response.ok) {
    const reason = response.status >= 500 ? 'ошибка на стороне сервера' : 'запрос отклонён'
    throw new ApiError(`Сервер погоды вернул ${response.status}: ${reason}.`, response.status)
  }

  try {
    return (await response.json()) as T
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new ApiError('Сервер погоды прислал некорректные данные.')
  }
}

/** Пауза, которую можно прервать через AbortSignal. */
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(new DOMException('Aborted', 'AbortError'))
      },
      { once: true },
    )
  })
}
