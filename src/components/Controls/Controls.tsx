import type { Category } from '../../types.ts'

/**
 * Панель управления: поиск, выбор горной системы, «Обновить», «Сбросить».
 *
 * TODO(часть 2): ВРЕМЕННАЯ ЗАГЛУШКА — только выбор горной системы без стилей.
 * Нужно сделать полноценную панель как во второй ДЗ (см. git show 2c06588:src/controls.js
 * и стили .controls-* / .field* / .input / .select в 2c06588:src/ui.css) на CSS Modules.
 * Интерфейс пропсов менять не нужно — App уже передаёт всё необходимое.
 */
export interface ControlsProps {
  /** список горных систем для выпадающего списка */
  categories: Category[]
  /** выбранная горная система; '' — все */
  category: string
  /** идёт загрузка: кнопка «Обновить» неактивна, иконка крутится */
  isBusy: boolean
  /** поиск: вызывать через 300 мс после ввода или сразу по Enter; с обрезанными пробелами */
  onSearch: (query: string) => void
  onCategoryChange: (slug: string) => void
  onRefresh: () => void
  /** «Сбросить»: App очищает query и category; поле ввода Controls очищает сам */
  onReset: () => void
}

export function Controls({ categories, category, onCategoryChange }: ControlsProps) {
  return (
    <select value={category} onChange={(e) => onCategoryChange(e.target.value)} aria-label="Горная система">
      <option value="">Все горные системы</option>
      {categories.map((c) => (
        <option key={c.slug} value={c.slug}>
          {c.name}
        </option>
      ))}
    </select>
  )
}
