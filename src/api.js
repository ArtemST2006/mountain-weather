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

import { MOUNTAINS, RANGES, getRangeName } from './mountains.js'
import { describeWeather } from './weather.js'

const API_URL = 'https://api.open-meteo.com/v1/forecast'

const pageParams = new URLSearchParams(window.location.search)
const DEBUG_FAIL = pageParams.has('fail')
const DEBUG_DELAY = Number(pageParams.get('delay')) || 0

/**
 * @typedef {Object} Category
 * @property {string} slug  значение фильтра, например "caucasus"
 * @property {string} name  название для показа, например "Кавказ"
 */

/**
 * @typedef {Object} SummitWeather
 * @property {number} temperature  температура на вершине, °C
 * @property {number} feelsLike    ощущается как, °C
 * @property {number} windSpeed    ветер, км/ч
 * @property {number} windGusts    порывы ветра, км/ч
 * @property {number} cloudCover   облачность, %
 * @property {number} code         код погоды WMO
 * @property {string} text         описание погоды по-русски, например «Снег»
 * @property {string} icon         эмодзи погоды, например «🌨️»
 * @property {boolean} isDay       день ли сейчас на вершине
 * @property {string} localTime    местное время на вершине, «ЧЧ:ММ»
 */

/**
 * @typedef {import('./mountains.js').Mountain & {
 *   rangeName: string,
 *   weather: SummitWeather
 * }} MountainWithWeather
 */

/** Ошибка, текст которой можно показать пользователю. */
export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} [status] HTTP-статус, если сервер ответил
   */
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** Список горных систем для фильтра. */
export function getCategories() {
  return RANGES
}

/**
 * Находит вершины по запросу и горной системе и загружает для них погоду.
 * Результат отсортирован по высоте (от самой высокой).
 *
 * @param {{ query?: string, category?: string, signal?: AbortSignal }} [params]
 * @returns {Promise<MountainWithWeather[]>}
 */
export async function fetchMountains({ query = '', category = '', signal } = {}) {
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

  const data = await request(buildUrl(mountains), signal)
  const locations = Array.isArray(data) ? data : [data]

  if (locations.length !== mountains.length) {
    throw new ApiError('Сервер прислал неполные данные о погоде.')
  }

  return mountains.map((mountain, i) => ({
    ...mountain,
    rangeName: getRangeName(mountain.range),
    weather: toSummitWeather(locations[i].current),
  }))
}

/** @param {import('./mountains.js').Mountain[]} mountains */
function buildUrl(mountains) {
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
 *
 * @param {URL} url
 * @param {AbortSignal} [signal]
 */
async function request(url, signal) {
  let response
  try {
    if (DEBUG_DELAY) await sleep(DEBUG_DELAY, signal)
    response = await fetch(url, { signal })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError('Не удалось связаться с сервером погоды. Проверьте подключение к интернету.')
  }

  if (!response.ok) {
    const reason = response.status >= 500 ? 'ошибка на стороне сервера' : 'запрос отклонён'
    throw new ApiError(`Сервер погоды вернул ${response.status}: ${reason}.`, response.status)
  }

  try {
    return await response.json()
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError('Сервер погоды прислал некорректные данные.')
  }
}

/** @returns {SummitWeather} */
function toSummitWeather(current) {
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
function sleep(ms, signal) {
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
