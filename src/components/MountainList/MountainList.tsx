import type { MountainWithWeather, SortKey } from '../../types.ts'
import { pluralize } from '../../utils/format.ts'
import { SORT_SUMMARY } from '../../utils/sort.ts'
import { MountainCard } from '../MountainCard/MountainCard.tsx'
import styles from './MountainList.module.css'

export interface MountainListProps {
  /** непустой массив, уже отсортирован */
  mountains: MountainWithWeather[]
  sort: SortKey
  onSelect: (mountain: MountainWithWeather) => void
}

export function MountainList({ mountains, sort, onSelect }: MountainListProps) {
  return (
    <>
      <p className={styles.summary}>{pluralize(mountains.length, ['вершина', 'вершины', 'вершин'])} · {SORT_SUMMARY[sort]}</p>
      <div className={styles.grid}>
        {mountains.map((mountain) => <MountainCard key={mountain.id} mountain={mountain} onSelect={onSelect} />)}
      </div>
    </>
  )
}
