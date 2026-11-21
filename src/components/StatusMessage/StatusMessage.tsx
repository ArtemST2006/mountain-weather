import { useEffect, useRef } from 'react'
import { Button } from '../Button/Button.tsx'
import styles from './StatusMessage.module.css'

type StatusMessageProps =
  | { kind: 'loading' }
  | { kind: 'empty' }
  | { kind: 'error'; message: string; onRetry: () => void }

/** Состояния приложения: загрузка, пустой результат, ошибка с повтором. */
export function StatusMessage(props: StatusMessageProps) {
  switch (props.kind) {
    case 'loading':
      return (
        <div className={`${styles.box} ${styles.loading}`} role="status">
          <span className={styles.spinner} aria-hidden="true" />
          <span>Загрузка…</span>
        </div>
      )
    case 'empty':
      return (
        <div className={styles.box} role="status">
          <strong className={styles.title}>Ничего не найдено</strong>
          <span>Такой вершины нет в каталоге. Измените запрос или выберите другую горную систему.</span>
        </div>
      )
    case 'error':
      return <ErrorMessage message={props.message} onRetry={props.onRetry} />
  }
}

function ErrorMessage({ message, onRetry }: { message: string; onRetry: () => void }) {
  const retryRef = useRef<HTMLButtonElement>(null)

  // Фокус на «Повторить», чтобы с клавиатуры можно было сразу нажать Enter
  useEffect(() => {
    retryRef.current?.focus()
  }, [])

  return (
    <div className={`${styles.box} ${styles.error}`} role="alert">
      <strong className={styles.title}>Не удалось загрузить данные</strong>
      <span>{message}</span>
      <Button ref={retryRef} variant="primary" className={styles.retry} onClick={onRetry}>
        Повторить
      </Button>
    </div>
  )
}
