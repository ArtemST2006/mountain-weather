/** Горная система — значение фильтра. */
export interface Category {
  /** значение фильтра, например "caucasus" */
  slug: string
  /** название для показа, например "Кавказ" */
  name: string
}

/** Вершина из справочника (src/data/mountains.ts). */
export interface Mountain {
  /** уникальный идентификатор */
  id: string
  /** название по-русски */
  name: string
  /** slug горной системы (см. RANGES) */
  range: string
  /** страна (или страны) */
  country: string
  /** высота вершины, м */
  elevation: number
  lat: number
  lon: number
  /** заголовок статьи английской Википедии */
  wiki: string
}

/** Текущая погода на высоте вершины. */
export interface SummitWeather {
  /** температура на вершине, °C */
  temperature: number
  /** ощущается как, °C */
  feelsLike: number
  /** ветер, км/ч */
  windSpeed: number
  /** порывы ветра, км/ч */
  windGusts: number
  /** облачность, % */
  cloudCover: number
  /** код погоды WMO */
  code: number
  /** описание погоды по-русски, например «Снег» */
  text: string
  /** эмодзи погоды, например «🌨️» */
  icon: string
  /** день ли сейчас на вершине */
  isDay: boolean
  /** местное время на вершине, «ЧЧ:ММ» */
  localTime: string
}

export interface MountainWithWeather extends Mountain {
  rangeName: string
  weather: SummitWeather
}

/** Параметры поиска вершин. */
export interface MountainFilters {
  query: string
  /** slug горной системы; '' — все */
  category: string
}

/** Состояние загрузки списка вершин. */
export type LoadState =
  | { status: 'loading' }
  | { status: 'empty' }
  | { status: 'error'; message: string }
  | { status: 'ready'; mountains: MountainWithWeather[] }
