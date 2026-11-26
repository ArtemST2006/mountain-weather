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

/** Порядок вершин в списке; сортировка идёт без нового запроса. */
export type SortKey = 'elevation' | 'temperature' | 'wind' | 'name'

/** Фото вершины из Wikipedia REST API. */
export interface MountainPhoto {
  /** уменьшенное фото для карточки */
  thumbnail?: string
  /** полноразмерное фото для окна вершины */
  original?: string
}

/** Один день прогноза на высоте вершины. */
export interface ForecastDay {
  /** дата «ГГГГ-ММ-ДД» (местная для вершины) */
  date: string
  code: number
  text: string
  icon: string
  /** минимальная и максимальная температура, °C */
  min: number
  max: number
  /** максимальный ветер, км/ч */
  wind: number
  /** снег за сутки, см */
  snow: number
}

/** Состояние загрузки списка вершин. */
export type LoadState =
  | { status: 'loading' }
  | { status: 'empty' }
  | { status: 'error'; message: string }
  | { status: 'ready'; mountains: MountainWithWeather[] }
