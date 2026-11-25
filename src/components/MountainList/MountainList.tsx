import type { MountainWithWeather } from '../../types.ts'
import { pluralize } from '../../utils/format.ts'
import { MountainCard } from '../MountainCard/MountainCard.tsx'
import styles from './MountainList.module.css'

export interface MountainListProps {
  mountains: MountainWithWeather[]
}

export function MountainList({ mountains }: MountainListProps) {
  return (
    <>
      <p className={styles.summary}>{pluralize(mountains.length, ['вершина', 'вершины', 'вершин'])} · от самой высокой</p>
      <div className={styles.grid}>
        {mountains.map((mountain) => <MountainCard key={mountain.id} mountain={mountain} />)}
      </div>
    </>
  )
}
