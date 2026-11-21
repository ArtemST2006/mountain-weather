import styles from './Hero.module.css'

/** Шапка с горным пейзажем. */
export function Hero() {
  return (
    <header className={styles.hero}>
      <svg className={styles.mountains} viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
        <path
          className={styles.far}
          d="M0 220 L90 170 L170 200 L260 120 L340 175 L430 140 L520 190 L610 110 L700 160 L790 95 L880 150 L960 125 L1050 180 L1140 115 L1230 165 L1320 130 L1440 175 L1440 320 L0 320 Z"
        />
        <path
          className={styles.mid}
          d="M0 260 L120 200 L200 235 L310 150 L390 215 L480 185 L560 230 L660 140 L720 180 L800 60 L880 170 L960 205 L1060 150 L1150 220 L1240 175 L1340 225 L1440 195 L1440 320 L0 320 Z"
        />
        <path className={styles.snow} d="M800 60 L838 112 L822 106 L812 118 L796 104 L784 114 L772 100 Z" />
        <path
          className={styles.near}
          d="M0 300 L150 255 L260 285 L380 240 L500 290 L640 250 L760 295 L900 245 L1030 290 L1170 255 L1300 290 L1440 260 L1440 320 L0 320 Z"
        />
      </svg>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Высочайшие горы мира · прямо сейчас</p>
        <h1 className={styles.title}>Погода на вершинах</h1>
        <p className={styles.subtitle}>
          Температура, ветер и облака на высоте самой вершины — от Эльбруса до Эвереста. Данные{' '}
          <a href="https://open-meteo.com/" target="_blank" rel="noopener">
            Open-Meteo
          </a>
          .
        </p>
      </div>
    </header>
  )
}
