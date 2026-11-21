import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      Погода:{' '}
      <a href="https://open-meteo.com/" target="_blank" rel="noopener">
        Open-Meteo API
      </a>{' '}
      · температура пересчитана на высоту вершины
    </footer>
  )
}
