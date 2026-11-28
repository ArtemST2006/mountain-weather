import { useEffect, useState } from 'react'
import { getMountainPhoto } from '../api/photos.ts'
import type { MountainPhoto } from '../types.ts'

/** Фото вершины из Википедии; null — пока грузится или фото нет. */
export function useMountainPhoto(wiki: string): MountainPhoto | null {
  const [photo, setPhoto] = useState<{ wiki: string; photo: MountainPhoto | null } | null>(null)

  useEffect(() => {
    let cancelled = false
    getMountainPhoto(wiki).then((result) => {
      if (!cancelled) setPhoto({ wiki, photo: result })
    })
    return () => {
      cancelled = true
    }
  }, [wiki])

  // Не показываем фото прошлой вершины, пока грузится новое
  return photo?.wiki === wiki ? photo.photo : null
}
