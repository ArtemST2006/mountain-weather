/**
 * Фотографии вершин из Wikipedia REST API (HTTPS, CORS, без ключа).
 * Промисы в кеше предотвращают повторные запросы, а очередь не даёт сорока карточкам
 * одновременно отправить сорок запросов.
 */

import type { MountainPhoto } from '../types.ts'

const SUMMARY_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary/'
const MAX_REQUESTS = 4

/** Нужная часть ответа /page/summary. */
interface WikiSummary {
  thumbnail?: { source: string }
  originalimage?: { source: string }
}

interface QueueItem {
  wiki: string
  resolve: (photo: MountainPhoto | null) => void
}

const photoCache = new Map<string, Promise<MountainPhoto | null>>()
const queue: QueueItem[] = []
let active = 0

/** Фото по заголовку статьи; null — фото нет или Википедия недоступна (ошибкой не считается). */
export function getMountainPhoto(wiki: string): Promise<MountainPhoto | null> {
  let photo = photoCache.get(wiki)
  if (!photo) {
    photo = new Promise((resolve) => {
      queue.push({ wiki, resolve })
      runQueue()
    })
    photoCache.set(wiki, photo)
  }
  return photo
}

function runQueue() {
  while (active < MAX_REQUESTS && queue.length) {
    const { wiki, resolve } = queue.shift()!
    active++
    fetch(SUMMARY_URL + encodeURIComponent(wiki))
      .then((response) => {
        if (!response.ok) throw new Error(`Wikipedia HTTP ${response.status}`)
        return response.json() as Promise<WikiSummary>
      })
      .then((data) => resolve({ thumbnail: data.thumbnail?.source, original: data.originalimage?.source }))
      .catch(() => resolve(null))
      .finally(() => {
        active--
        runQueue()
      })
  }
}
