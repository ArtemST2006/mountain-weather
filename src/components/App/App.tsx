import { useMemo, useState } from 'react'
import { getCategories } from '../../api/weather.ts'
import { useMountains } from '../../hooks/useMountains.ts'
import type { MountainWithWeather, SortKey } from '../../types.ts'
import { sortMountains } from '../../utils/sort.ts'
import { Controls } from '../Controls/Controls.tsx'
import { Footer } from '../Footer/Footer.tsx'
import { Hero } from '../Hero/Hero.tsx'
import { MountainDetails } from '../MountainDetails/MountainDetails.tsx'
import { MountainList } from '../MountainList/MountainList.tsx'
import { StatusMessage } from '../StatusMessage/StatusMessage.tsx'
import styles from './App.module.css'

const categories = getCategories()

export function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState<SortKey>('elevation')
  const [selected, setSelected] = useState<MountainWithWeather | null>(null)
  const { state, reload, isLoading } = useMountains({ query, category })

  // Сортировка уже загруженных вершин — без нового запроса
  const mountains = useMemo(
    () => (state.status === 'ready' ? sortMountains(state.mountains, sort) : []),
    [state, sort],
  )

  // Окно показываем, только пока вершина есть в текущем ответе:
  // новый запрос (поиск, фильтр, «Обновить») закрывает его, как во ДЗ №2
  const details = selected && mountains.includes(selected) ? selected : null

  const handleReset = () => {
    setQuery('')
    setCategory('')
    setSort('elevation')
  }

  return (
    <>
      <Hero />

      <main className={styles.page}>
        <section className={styles.controls} aria-label="Поиск и фильтры">
          <Controls
            categories={categories}
            category={category}
            sort={sort}
            isBusy={isLoading}
            onSearch={setQuery}
            onCategoryChange={setCategory}
            onSortChange={setSort}
            onRefresh={reload}
            onReset={handleReset}
          />
        </section>

        {/* aria-live: экранные дикторы озвучат смену состояния */}
        <section aria-live="polite">
          {state.status === 'loading' && <StatusMessage kind="loading" />}
          {state.status === 'empty' && <StatusMessage kind="empty" />}
          {state.status === 'error' && <StatusMessage kind="error" message={state.message} onRetry={reload} />}
        </section>

        {state.status === 'ready' && (
          <section aria-label="Вершины">
            <MountainList mountains={mountains} sort={sort} onSelect={setSelected} />
          </section>
        )}
      </main>

      {details && <MountainDetails key={details.id} mountain={details} onClose={() => setSelected(null)} />}

      <Footer />
    </>
  )
}
