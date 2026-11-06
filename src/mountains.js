/**
 * Справочник вершин и горных систем.
 * Координаты и высоты — по Википедии. Погоду для каждой вершины загружает src/api.js.
 *
 * @typedef {Object} Mountain
 * @property {string} id         уникальный идентификатор
 * @property {string} name       название по-русски
 * @property {string} range      slug горной системы (см. RANGES)
 * @property {string} country    страна (или страны)
 * @property {number} elevation  высота вершины, м
 * @property {number} lat        широта
 * @property {number} lon        долгота
 * @property {string} wiki       заголовок статьи английской Википедии (для фото и ссылки)
 */

/** @type {import('./api.js').Category[]} */
export const RANGES = [
  { slug: 'himalaya', name: 'Гималаи' },
  { slug: 'karakoram', name: 'Каракорум' },
  { slug: 'pamir-tianshan', name: 'Памир и Тянь-Шань' },
  { slug: 'caucasus', name: 'Кавказ' },
  { slug: 'alps', name: 'Альпы' },
  { slug: 'andes', name: 'Анды' },
  { slug: 'north-america', name: 'Горы Северной Америки' },
  { slug: 'africa', name: 'Горы Африки' },
  { slug: 'siberia', name: 'Сибирь и Дальний Восток' },
  { slug: 'other', name: 'Другие вершины мира' },
]

/** @type {Mountain[]} */
export const MOUNTAINS = [
  // Гималаи
  { id: 'everest', name: 'Эверест (Джомолунгма)', range: 'himalaya', country: 'Непал, Китай', elevation: 8849, lat: 27.9881, lon: 86.925, wiki: 'Mount_Everest' },
  { id: 'kangchenjunga', name: 'Канченджанга', range: 'himalaya', country: 'Непал, Индия', elevation: 8586, lat: 27.7025, lon: 88.1475, wiki: 'Kangchenjunga' },
  { id: 'lhotse', name: 'Лхоцзе', range: 'himalaya', country: 'Непал, Китай', elevation: 8516, lat: 27.9617, lon: 86.9333, wiki: 'Lhotse' },
  { id: 'makalu', name: 'Макалу', range: 'himalaya', country: 'Непал, Китай', elevation: 8485, lat: 27.8897, lon: 87.0889, wiki: 'Makalu' },
  { id: 'cho-oyu', name: 'Чо-Ойю', range: 'himalaya', country: 'Непал, Китай', elevation: 8188, lat: 28.0942, lon: 86.6608, wiki: 'Cho_Oyu' },
  { id: 'dhaulagiri', name: 'Дхаулагири', range: 'himalaya', country: 'Непал', elevation: 8167, lat: 28.6967, lon: 83.4875, wiki: 'Dhaulagiri' },
  { id: 'nanga-parbat', name: 'Нанга-Парбат', range: 'himalaya', country: 'Пакистан', elevation: 8126, lat: 35.2375, lon: 74.5892, wiki: 'Nanga_Parbat' },
  { id: 'annapurna', name: 'Аннапурна', range: 'himalaya', country: 'Непал', elevation: 8091, lat: 28.5961, lon: 83.8203, wiki: 'Annapurna' },
  { id: 'ama-dablam', name: 'Ама-Даблам', range: 'himalaya', country: 'Непал', elevation: 6812, lat: 27.8617, lon: 86.8614, wiki: 'Ama_Dablam' },

  // Каракорум
  { id: 'k2', name: 'К2 (Чогори)', range: 'karakoram', country: 'Пакистан, Китай', elevation: 8611, lat: 35.8825, lon: 76.5133, wiki: 'K2' },
  { id: 'gasherbrum-1', name: 'Гашербрум I', range: 'karakoram', country: 'Пакистан, Китай', elevation: 8080, lat: 35.7247, lon: 76.6964, wiki: 'Gasherbrum_I' },
  { id: 'broad-peak', name: 'Броуд-Пик', range: 'karakoram', country: 'Пакистан, Китай', elevation: 8051, lat: 35.8106, lon: 76.5681, wiki: 'Broad_Peak' },

  // Памир и Тянь-Шань
  { id: 'somoni', name: 'Пик Исмоила Сомони', range: 'pamir-tianshan', country: 'Таджикистан', elevation: 7495, lat: 38.9417, lon: 72.0153, wiki: 'Ismoil_Somoni_Peak' },
  { id: 'pobeda', name: 'Пик Победы', range: 'pamir-tianshan', country: 'Киргизия, Китай', elevation: 7439, lat: 42.0353, lon: 80.1253, wiki: 'Jengish_Chokusu' },
  { id: 'lenin', name: 'Пик Ленина', range: 'pamir-tianshan', country: 'Киргизия, Таджикистан', elevation: 7134, lat: 39.3433, lon: 72.8775, wiki: 'Lenin_Peak' },
  { id: 'khan-tengri', name: 'Хан-Тенгри', range: 'pamir-tianshan', country: 'Казахстан, Киргизия, Китай', elevation: 7010, lat: 42.2111, lon: 80.1747, wiki: 'Khan_Tengri' },

  // Кавказ
  { id: 'elbrus', name: 'Эльбрус', range: 'caucasus', country: 'Россия', elevation: 5642, lat: 43.3499, lon: 42.4453, wiki: 'Mount_Elbrus' },
  { id: 'shkhara', name: 'Шхара', range: 'caucasus', country: 'Грузия, Россия', elevation: 5193, lat: 42.9997, lon: 43.1131, wiki: 'Shkhara' },
  { id: 'kazbek', name: 'Казбек', range: 'caucasus', country: 'Грузия, Россия', elevation: 5054, lat: 42.6997, lon: 44.5181, wiki: 'Mount_Kazbek' },
  { id: 'ushba', name: 'Ушба', range: 'caucasus', country: 'Грузия', elevation: 4710, lat: 43.1272, lon: 42.6672, wiki: 'Ushba' },

  // Альпы
  { id: 'mont-blanc', name: 'Монблан', range: 'alps', country: 'Франция, Италия', elevation: 4806, lat: 45.8326, lon: 6.8652, wiki: 'Mont_Blanc' },
  { id: 'matterhorn', name: 'Маттерхорн', range: 'alps', country: 'Швейцария, Италия', elevation: 4478, lat: 45.9763, lon: 7.6586, wiki: 'Matterhorn' },
  { id: 'eiger', name: 'Айгер', range: 'alps', country: 'Швейцария', elevation: 3967, lat: 46.5775, lon: 8.0053, wiki: 'Eiger' },
  { id: 'grossglockner', name: 'Гросглокнер', range: 'alps', country: 'Австрия', elevation: 3798, lat: 47.0742, lon: 12.6947, wiki: 'Grossglockner' },
  { id: 'zugspitze', name: 'Цугшпитце', range: 'alps', country: 'Германия, Австрия', elevation: 2962, lat: 47.4211, lon: 10.9853, wiki: 'Zugspitze' },

  // Анды
  { id: 'aconcagua', name: 'Аконкагуа', range: 'andes', country: 'Аргентина', elevation: 6961, lat: -32.6532, lon: -70.0109, wiki: 'Aconcagua' },
  { id: 'ojos-del-salado', name: 'Охос-дель-Саладо', range: 'andes', country: 'Аргентина, Чили', elevation: 6893, lat: -27.1092, lon: -68.5414, wiki: 'Ojos_del_Salado' },
  { id: 'huascaran', name: 'Уаскаран', range: 'andes', country: 'Перу', elevation: 6768, lat: -9.1222, lon: -77.6042, wiki: 'Huascarán' },
  { id: 'chimborazo', name: 'Чимборасо', range: 'andes', country: 'Эквадор', elevation: 6263, lat: -1.4692, lon: -78.8175, wiki: 'Chimborazo' },
  { id: 'fitz-roy', name: 'Фицрой', range: 'andes', country: 'Аргентина, Чили', elevation: 3405, lat: -49.2714, lon: -73.0431, wiki: 'Monte_Fitz_Roy' },

  // Северная Америка
  { id: 'denali', name: 'Денали', range: 'north-america', country: 'США (Аляска)', elevation: 6190, lat: 63.0692, lon: -151.007, wiki: 'Denali' },
  { id: 'logan', name: 'Логан', range: 'north-america', country: 'Канада', elevation: 5959, lat: 60.5672, lon: -140.4053, wiki: 'Mount_Logan' },
  { id: 'rainier', name: 'Рейнир', range: 'north-america', country: 'США', elevation: 4392, lat: 46.8528, lon: -121.7603, wiki: 'Mount_Rainier' },

  // Африка
  { id: 'kilimanjaro', name: 'Килиманджаро', range: 'africa', country: 'Танзания', elevation: 5895, lat: -3.0674, lon: 37.3556, wiki: 'Mount_Kilimanjaro' },
  { id: 'kenya', name: 'Кения', range: 'africa', country: 'Кения', elevation: 5199, lat: -0.1521, lon: 37.3084, wiki: 'Mount_Kenya' },

  // Сибирь и Дальний Восток
  { id: 'klyuchevskaya', name: 'Ключевская Сопка', range: 'siberia', country: 'Россия (Камчатка)', elevation: 4754, lat: 56.0567, lon: 160.6383, wiki: 'Klyuchevskaya_Sopka' },
  { id: 'belukha', name: 'Белуха', range: 'siberia', country: 'Россия, Казахстан', elevation: 4506, lat: 49.8075, lon: 86.5889, wiki: 'Belukha_Mountain' },

  // Другие
  { id: 'vinson', name: 'Массив Винсон', range: 'other', country: 'Антарктида', elevation: 4892, lat: -78.5254, lon: -85.6171, wiki: 'Vinson_Massif' },
  { id: 'puncak-jaya', name: 'Пунчак-Джая', range: 'other', country: 'Индонезия', elevation: 4884, lat: -4.0833, lon: 137.1833, wiki: 'Puncak_Jaya' },
  { id: 'fuji', name: 'Фудзияма', range: 'other', country: 'Япония', elevation: 3776, lat: 35.3606, lon: 138.7274, wiki: 'Mount_Fuji' },
]

const rangeNames = new Map(RANGES.map((r) => [r.slug, r.name]))

/** @param {string} slug */
export function getRangeName(slug) {
  return rangeNames.get(slug) ?? slug
}
