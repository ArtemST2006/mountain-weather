/**
 * Загрузка текущей погоды на вершинах из Open-Meteo (https://open-meteo.com/en/docs).
 * HTTPS, CORS, без ключа. Одним запросом получаем погоду сразу для всех нужных вершин,
 * а параметр elevation пересчитывает температуру на высоту самой вершины.
 *
 * Отладочные параметры адреса страницы (работают и на опубликованном сайте):
 *   ?delay=3000 — перед ответом пауза 3 с (видно состояние «Загрузка…»);
 *   ?fail       — запрос уходит с неверными координатами, API вернёт HTTP 400
 *                 (видно состояние ошибки и кнопку «Повторить»).
 */

import { MOUNTAINS, RANGES, getRangeName } from '../data/mountains.ts'
import type { Category, Mountain, MountainFilters, MountainWithWeather, SummitWeather } from '../types.ts'
import { describeWeather } from '../utils/weatherCodes.ts'

const API_URL = 'https://api.open-meteo.com/v1/forecast'

const pageParams = new URLSearchParams(window.location.search)
const DEBUG_FAIL = pageParams.has('fail')
const DEBUG_DELAY = Number(pageParams.get('delay')) || 0

/** Поле `current` ответа Open-Meteo — только то, что мы запрашиваем. */
interface OpenMeteoCurrent {
  time: string
  temperature_2m: number
  apparent_temperature: number
  wind_speed_10m: number
  wind_gusts_10m: number
  cloud_cover: number
  weather_code: number
  is_day: 0 | 1
}

interface OpenMeteoLocation {
  current: OpenMeteoCurrent
}

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

/** Список горных систем для фильтра. */
export function getCategories(): Category[] {
  return RANGES
}

/**
 * Находит вершины по запросу и горной системе и загружает для них погоду.
 * Результат отсортирован по высоте (от самой высокой).
 */
export async function fetchMountains(
  { query, category }: MountainFilters,
  signal?: AbortSignal,
): Promise<MountainWithWeather[]> {
  const needle = query.trim().toLowerCase()
  const mountains = MOUNTAINS.filter(
    (m) =>
      (!category || m.range === category) &&
      (!needle ||
        m.name.toLowerCase().includes(needle) ||
        m.country.toLowerCase().includes(needle) ||
        m.wiki.toLowerCase().replaceAll('_', ' ').includes(needle)),
  ).sort((a, b) => b.elevation - a.elevation)

  if (mountains.length === 0) return []

  const data = await request<OpenMeteoLocation | OpenMeteoLocation[]>(buildUrl(mountains), signal)
  const locations = Array.isArray(data) ? data : [data]

  if (locations.length !== mountains.length) {
    throw new ApiError('Сервер прислал неполные данные о погоде.')
  }

  return mountains.map((mountain, i) => ({
    ...mountain,
    rangeName: getRangeName(mountain.range),
    weather: toSummitWeather(locations[i]!.current),
  }))
}

function buildUrl(mountains: Mountain[]): URL {
  const url = new URL(API_URL)
  url.searchParams.set('latitude', DEBUG_FAIL ? '999' : mountains.map((m) => m.lat).join(','))
  url.searchParams.set('longitude', mountains.map((m) => m.lon).join(','))
  url.searchParams.set('elevation', mountains.map((m) => m.elevation).join(','))
  url.searchParams.set(
    'current',
    'temperature_2m,apparent_temperature,wind_speed_10m,wind_gusts_10m,cloud_cover,weather_code,is_day',
  )
  url.searchParams.set('wind_speed_unit', 'kmh')
  url.searchParams.set('timezone', 'auto')
  return url
}

/**
 * GET-запрос с проверкой response.ok.
 * fetch не отклоняет промис при 400/500 — поэтому статус проверяем сами.
 */
async function request<T>(url: URL, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    if (DEBUG_DELAY) await sleep(DEBUG_DELAY, signal)
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

function toSummitWeather(current: OpenMeteoCurrent): SummitWeather {
  const isDay = current.is_day === 1
  return {
    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    windSpeed: Math.round(current.wind_speed_10m),
    windGusts: Math.round(current.wind_gusts_10m),
    cloudCover: current.cloud_cover,
    code: current.weather_code,
    isDay,
    localTime: current.time.slice(11, 16),
    ...describeWeather(current.weather_code, isDay),
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
