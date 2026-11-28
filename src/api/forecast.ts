/** Прогноз на 7 дней на высоте вершины (Open-Meteo, параметр daily). */

import type { ForecastDay, Mountain } from '../types.ts'
import { describeWeather } from '../utils/weatherCodes.ts'
import { ApiError, requestJson } from './http.ts'

const API_URL = 'https://api.open-meteo.com/v1/forecast'
const DAYS = 7

const DAILY_FIELDS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'wind_speed_10m_max',
  'snowfall_sum',
] as const

type DailyField = (typeof DAILY_FIELDS)[number]

/** Поле `daily` ответа Open-Meteo: массивы значений по дням. */
type OpenMeteoDaily = { time: string[] } & Record<DailyField, number[]>

export async function fetchForecast(mountain: Mountain, signal?: AbortSignal): Promise<ForecastDay[]> {
  const url = new URL(API_URL)
  url.searchParams.set('latitude', String(mountain.lat))
  url.searchParams.set('longitude', String(mountain.lon))
  url.searchParams.set('elevation', String(mountain.elevation))
  url.searchParams.set('daily', DAILY_FIELDS.join(','))
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('forecast_days', String(DAYS))

  const data = await requestJson<{ daily?: Partial<OpenMeteoDaily> }>(url, signal)
  const daily = data.daily
  if (!isValidDaily(daily)) throw new ApiError('Сервер погоды прислал неполный прогноз.')

  return daily.time.slice(0, DAYS).map((date, i) => {
    const code = daily.weather_code[i]!
    return {
      date,
      code,
      ...describeWeather(code, true),
      min: daily.temperature_2m_min[i]!,
      max: daily.temperature_2m_max[i]!,
      wind: Math.round(daily.wind_speed_10m_max[i]!),
      snow: daily.snowfall_sum[i]!,
    }
  })
}

function isValidDaily(daily: Partial<OpenMeteoDaily> | undefined): daily is OpenMeteoDaily {
  if (!daily) return false
  return (['time', ...DAILY_FIELDS] as const).every((key) => {
    const values = daily[key]
    return Array.isArray(values) && values.length >= DAYS
  })
}
