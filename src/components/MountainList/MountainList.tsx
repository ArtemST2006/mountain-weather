import type { MountainWithWeather } from '../../types.ts'
import { formatTemp } from '../../utils/format.ts'

/**
 * Список вершин карточками.
 *
 * TODO(часть 2): ВРЕМЕННАЯ ЗАГЛУШКА — простой список без стилей.
 * Нужно сделать сетку карточек как во второй ДЗ (см. git show 2c06588:src/render.js
 * и стили .grid / .card* / .sky--* / .temp* / .stat* в 2c06588:src/ui.css) на CSS Modules,
 * вынеся карточку в отдельный компонент MountainCard.
 */
export interface MountainListProps {
  /** непустой массив, уже отсортирован по высоте */
  mountains: MountainWithWeather[]
}

export function MountainList({ mountains }: MountainListProps) {
  return (
    <ul>
      {mountains.map((m) => (
        <li key={m.id}>
          {m.name} — {m.elevation} м: {m.weather.icon} {formatTemp(m.weather.temperature)}, {m.weather.text}
        </li>
      ))}
    </ul>
  )
}
