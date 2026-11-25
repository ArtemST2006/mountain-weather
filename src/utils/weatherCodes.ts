/**
 * Расшифровка кодов погоды WMO, которые возвращает Open-Meteo.
 * https://open-meteo.com/en/docs (раздел «WMO Weather interpretation codes»)
 */

/** код → [описание, значок] */
const CODES: Record<number, [text: string, icon: string]> = {
  0: ['Ясно', '☀️'],
  1: ['Преимущественно ясно', '🌤️'],
  2: ['Переменная облачность', '⛅'],
  3: ['Пасмурно', '☁️'],
  45: ['Туман', '🌫️'],
  48: ['Туман с изморозью', '🌫️'],
  51: ['Слабая морось', '🌦️'],
  53: ['Морось', '🌦️'],
  55: ['Сильная морось', '🌧️'],
  56: ['Ледяная морось', '🌧️'],
  57: ['Сильная ледяная морось', '🌧️'],
  61: ['Небольшой дождь', '🌦️'],
  63: ['Дождь', '🌧️'],
  65: ['Сильный дождь', '🌧️'],
  66: ['Ледяной дождь', '🌧️'],
  67: ['Сильный ледяной дождь', '🌧️'],
  71: ['Небольшой снег', '🌨️'],
  73: ['Снег', '🌨️'],
  75: ['Сильный снегопад', '❄️'],
  77: ['Снежная крупа', '🌨️'],
  80: ['Небольшой ливень', '🌦️'],
  81: ['Ливень', '🌧️'],
  82: ['Сильный ливень', '⛈️'],
  85: ['Снежный заряд', '🌨️'],
  86: ['Сильный снежный заряд', '❄️'],
  95: ['Гроза', '⛈️'],
  96: ['Гроза с градом', '⛈️'],
  99: ['Сильная гроза с градом', '⛈️'],
}

export function describeWeather(code: number, isDay: boolean): { text: string; icon: string } {
  const [text, icon] = CODES[code] ?? ['Нет данных', '❔']
  if (!isDay && (code === 0 || code === 1)) return { text, icon: '🌙' }
  return { text, icon }
}

export type SkyType = 'clear' | 'cloudy' | 'fog' | 'snow' | 'rain' | 'storm'

/** Тип неба по коду погоды WMO — определяет цвет верхней части карточки. */
export function skyType(code: number): SkyType {
  if (code <= 1) return 'clear'
  if (code <= 3) return 'cloudy'
  if (code <= 48) return 'fog'
  if (code >= 95) return 'storm'
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow'
  return 'rain'
}

export type TempTone = 'extreme' | 'frost' | 'cold' | 'mild' | 'warm'

/** Оттенок температуры: от лютого мороза до тепла. */
export function tempTone(t: number): TempTone {
  if (t <= -30) return 'extreme'
  if (t <= -15) return 'frost'
  if (t < 0) return 'cold'
  if (t < 15) return 'mild'
  return 'warm'
}
