import { useState } from 'react'
import { getCategories } from '../../api/weather.ts'
import { useMountains } from '../../hooks/useMountains.ts'
import { Controls } from '../Controls/Controls.tsx'
import { Footer } from '../Footer/Footer.tsx'
import { Hero } from '../Hero/Hero.tsx'
import { MountainList } from '../MountainList/MountainList.tsx'
import { StatusMessage } from '../StatusMessage/StatusMessage.tsx'
import styles from './App.module.css'

const categories = getCategories()

export function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const { state, reload, isLoading } = useMountains({ query, category })

  const handleReset = () => {
    setQuery('')
    setCategory('')
  }

  return (
    <>
      <Hero />

      <main className={styles.page}>
        <section className={styles.controls} aria-label="Поиск и фильтры">
          <Controls
            categories={categories}
            category={category}
            isBusy={isLoading}
            onSearch={setQuery}
            onCategoryChange={setCategory}
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
            <MountainList mountains={state.mountains} />
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}
