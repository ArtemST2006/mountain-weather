import type { MountainWithWeather, SortKey } from '../types.ts'

/** Варианты сортировки для выпадающего списка. */
export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'elevation', label: 'По высоте' },
  { value: 'temperature', label: 'По температуре (холодные)' },
  { value: 'wind', label: 'По ветру (сильный)' },
  { value: 'name', label: 'По названию' },
]

/** Подпись к итогу над сеткой: «40 вершин · от самой холодной». */
export const SORT_SUMMARY: Record<SortKey, string> = {
  elevation: 'от самой высокой',
  temperature: 'от самой холодной',
  wind: 'от самого сильного ветра',
  name: 'по названию',
}

export function isSortKey(value: string): value is SortKey {
  return SORT_OPTIONS.some((option) => option.value === value)
}

const byName = (a: MountainWithWeather, b: MountainWithWeather) => a.name.localeCompare(b.name, 'ru')

/** Возвращает новый отсортированный массив, исходный не меняет. */
export function sortMountains(mountains: MountainWithWeather[], sort: SortKey): MountainWithWeather[] {
  const sorted = [...mountains]
  switch (sort) {
    case 'temperature':
      return sorted.sort((a, b) => a.weather.temperature - b.weather.temperature || byName(a, b))
    case 'wind':
      return sorted.sort((a, b) => b.weather.windSpeed - a.weather.windSpeed || byName(a, b))
    case 'name':
      return sorted.sort(byName)
    case 'elevation':
      return sorted.sort((a, b) => b.elevation - a.elevation)
  }
}
