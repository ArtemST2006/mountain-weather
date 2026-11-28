import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { Category, SortKey } from '../../types.ts'
import { SORT_OPTIONS, isSortKey } from '../../utils/sort.ts'
import { Button } from '../Button/Button.tsx'
import styles from './Controls.module.css'

export interface ControlsProps {
  categories: Category[]
  category: string
  sort: SortKey
  isBusy: boolean
  onSearch: (query: string) => void
  onCategoryChange: (slug: string) => void
  onSortChange: (sort: SortKey) => void
  onRefresh: () => void
  onReset: () => void
}

export function Controls({ categories, category, sort, isBusy, onSearch, onCategoryChange, onSortChange, onRefresh, onReset }: ControlsProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastQueryRef = useRef('')

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed === lastQueryRef.current) return
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      if (trimmed !== lastQueryRef.current) {
        lastQueryRef.current = trimmed
        onSearch(trimmed)
      }
    }, 300)
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [query, onSearch])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (timerRef.current !== null) clearTimeout(timerRef.current)
    timerRef.current = null
    const trimmed = query.trim()
    if (trimmed !== lastQueryRef.current) {
      lastQueryRef.current = trimmed
      onSearch(trimmed)
    }
  }

  const handleReset = () => {
    if (timerRef.current !== null) clearTimeout(timerRef.current)
    timerRef.current = null
    lastQueryRef.current = ''
    setQuery('')
    onReset()
    inputRef.current?.focus()
  }

  return (
    <form className={styles.form} role="search" onSubmit={handleSubmit}>
      <label className={[styles.field, styles.search].join(' ')}>
        <span className={styles.fieldLabel}>Поиск вершины</span>
        <span className={styles.fieldControl}>
          <svg className={styles.fieldIcon} viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
          </svg>
          <input ref={inputRef} className={styles.input} type="search" name="query" autoComplete="off"
            placeholder="Эльбрус, Непал, Matterhorn…" value={query}
            onChange={(event) => setQuery(event.target.value)} />
        </span>
      </label>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Сортировка</span>
        <span className={styles.fieldControl}>
          <select className={[styles.input, styles.select].join(' ')} name="sort" value={sort}
            onChange={(event) => { if (isSortKey(event.target.value)) onSortChange(event.target.value) }}>
            {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </span>
      </label>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Горная система</span>
        <span className={styles.fieldControl}>
          <select className={[styles.input, styles.select].join(' ')} name="range" value={category}
            onChange={(event) => onCategoryChange(event.target.value)}>
            <option value="">Все горные системы</option>
            {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
        </span>
      </label>
      <div className={styles.actions}>
        <Button className={styles.actionButton} onClick={onRefresh} disabled={isBusy}>
          <svg className={[styles.buttonIcon, isBusy && styles.busy].filter(Boolean).join(' ')} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 12a8 8 0 1 1-2.34-5.66" /><path d="M20 4v5h-5" />
          </svg>
          Обновить
        </Button>
        {(query.trim() || category || sort !== 'elevation') &&<Button className={styles.actionButton} variant="ghost" onClick={handleReset}>Сбросить</Button>}
      </div>
    </form>
  )
}
