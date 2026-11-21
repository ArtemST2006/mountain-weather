# Промпт для ИИ: ДЗ №3, часть 2

Скопируй всё, что ниже линии, и отдай своей ИИ (Claude Code, Cursor и т. п.),
открыв её в корне репозитория `mountain-weather` после `git pull`.

---

Ты помогаешь доделать учебное ДЗ №3 по веб-разработке. Репозиторий — приложение
«Погода на вершинах»: каталог высочайших гор мира с текущей погодой на высоте вершины
(API Open-Meteo). Во ДЗ №2 оно было на Vite + Vanilla JS. **ТЗ ДЗ №3: переписать его на
React + TypeScript, стили — на CSS Modules** (Tailwind не используем).

## Что уже сделано (часть 1 — не переделывай)

- Vite 8 + React 19 + TypeScript (строгий `tsconfig.json`, `noUncheckedIndexedAccess`),
  `npm run build` = `tsc && vite build`, `npm run typecheck` = только проверка типов.
- `src/types.ts` — все типы: `Category`, `Mountain`, `SummitWeather`, `MountainWithWeather`,
  `MountainFilters`, `LoadState`.
- `src/data/mountains.ts` — справочник вершин и горных систем.
- `src/api/weather.ts` — `fetchMountains()`, `ApiError`, `getCategories()`,
  отладочные `?delay=3000` и `?fail`.
- `src/hooks/useMountains.ts` — загрузка с `AbortController`, `reload()`, `isLoading`.
- `src/utils/format.ts` — `formatTemp`, `formatNumber`, `pluralize`.
- `src/utils/weatherCodes.ts` — `describeWeather`, `skyType(code)`, `tempTone(t)`
  (возвращают строковые union-типы `SkyType` / `TempTone`).
- `src/styles/global.css` — **единственный глобальный CSS**: переменные темы
  (`--color-*`, `--radius`, `--gap`, `--shadow`), тёмная тема, сброс.
- Готовые компоненты, каждый в своей папке с `*.module.css`:
  `App` (состояние фильтров, раскладка, плашка панели поиска), `Hero`, `Footer`,
  `StatusMessage` (загрузка / пусто / ошибка с «Повторить»), `Button`
  (`variant: 'default' | 'primary' | 'ghost'`, принимает `className` и `ref`).

## Что нужно сделать (часть 2)

Сейчас `src/components/Controls/Controls.tsx` и `src/components/MountainList/MountainList.tsx` —
**временные заглушки без стилей** (помечены `TODO(часть 2)`). Их нужно заменить полноценной
реализацией, которая выглядит и работает **так же, как во ДЗ №2**. Исходный код ДЗ №2
лежит в истории git — смотри его командами:

```bash
git show 2c06588:src/controls.js   # логика панели поиска
git show 2c06588:src/render.js     # разметка карточек и SVG-силуэт горы
git show 2c06588:src/ui.css        # стили панели и карточек (переносить в модули)
git show 2c06588:src/style.css     # кнопки и состояния (уже перенесены — для справки)
```

### 1. `Controls` — панель поиска

Файлы: `src/components/Controls/Controls.tsx` + `Controls.module.css`.

- **Интерфейс `ControlsProps` не меняй** — `App` уже передаёт `categories`, `category`,
  `isBusy`, `onSearch`, `onCategoryChange`, `onRefresh`, `onReset`.
- `<form role="search">` с тремя частями (как в ДЗ №2):
  - поле «Поиск вершины» (`type="search"`, иконка-лупа SVG слева, placeholder
    `Эльбрус, Непал, Matterhorn…`). Значение — локальный `useState`.
    `onSearch(query.trim())` вызывается **через 300 мс после последнего ввода**
    (debounce через `useEffect` + `setTimeout` с очисткой) **или сразу по Enter**
    (submit формы, `preventDefault`). Не вызывать повторно, если запрос не изменился
    (хранить последний отправленный в `useRef`);
  - выпадающий список «Горная система»: первый пункт «Все горные системы» (`''`),
    управляемый — `value={category}`, `onChange` → `onCategoryChange`;
  - кнопки: «Обновить» (иконка-стрелка SVG, `disabled={isBusy}`, при `isBusy`
    иконка вращается) и «Сбросить» (`variant="ghost"`, показывается только если
    в поле есть текст или выбрана горная система; очищает поле, отменяет
    отложенный поиск, вызывает `onReset()` и возвращает фокус в поле через `useRef`).
- Используй общий `Button` из `src/components/Button/Button.tsx`, не дублируй стили кнопок.
- Стили — из `ui.css` ДЗ №2: `.controls-form`, `.field*`, `.input`, `.select`,
  `.controls-actions`, `.button-icon`, `.is-busy` и адаптив `@media (max-width: 960px)`
  и `(max-width: 600px)` для формы. Плашку `.controls` (фон, рамка, тень) уже рисует
  `App.module.css` — не дублируй. `@keyframes spin` объяви прямо в модуле
  (в CSS Modules keyframes локальные).
- `<label>` связаны с полями (оборачиванием или `htmlFor`/`useId`) — доступность важна.

### 2. `MountainList` и `MountainCard` — карточки вершин

Файлы: `src/components/MountainList/MountainList.tsx` + `.module.css`,
новый `src/components/MountainCard/MountainCard.tsx` + `.module.css`,
по желанию `src/components/MountainCard/Ridge.tsx` (силуэт) и `src/utils/ridge.ts`.

- **Интерфейс `MountainListProps` не меняй** (`mountains: MountainWithWeather[]`, непустой).
- `MountainList`: строка-итог «`pluralize(n, ['вершина','вершины','вершин'])` · от самой высокой»
  (`.results-summary`) и сетка карточек (`.grid`, `auto-fill, minmax(270px, 1fr)`),
  `key={mountain.id}`.
- `MountainCard` (проп `mountain: MountainWithWeather`), `<article>` как в `render.js`:
  - верх (`.card-media`, 140 px): небо по погоде — класс по `skyType(code)` и отдельный
    ночной вариант, если `!weather.isDay` (все градиенты `.sky--*` и `.is-night.*` из `ui.css`);
    силуэт горы SVG; чип с названием горной системы; высота `formatNumber(elevation) м`;
    эмодзи погоды (`aria-hidden`);
  - силуэт: перенеси `ridgeSvg`, `seededRandom` (mulberry32), `lerp`, `jitter` из `render.js`
    в типизированные функции, возвращающие строки `d` для трёх `<path>` (дальний хребет,
    главная вершина, снежная шапка); рендери JSX-ом, **без `dangerouslySetInnerHTML`**.
    Форма должна зависеть только от `mountain.id` и `elevation` (оберни в `useMemo`).
    `MAX_ELEVATION = 8849`;
  - тело: `<h2>` название, страна, температура `formatTemp` крупно с цветом по
    `tempTone(t)` (5 тонов + отдельные цвета для тёмной темы из `ui.css`),
    описание погоды и «ощущается как …»;
  - `<dl>` из трёх показателей (`dt`/`dd`): Ветер `N км/ч` + «порывы до N»,
    Облачность `N %`, Местное время `ЧЧ:ММ` + «день»/«ночь». Вынеси в маленький
    компонент `Stat` с пропами `term`, `value`, `hint?`;
  - hover-эффект (подъём и тень) и `@media (prefers-reduced-motion: reduce)` без анимации.
- Модификаторы через объект `styles`: например `styles[`sky_${type}`]` или
  `styles[type]` — имена классов в модуле должны совпадать с union-типами
  (`clear`, `cloudy`, …; `extreme`, `frost`, …), чтобы обращение было типобезопасным
  по смыслу. Комбинируй классы через `[...].filter(Boolean).join(' ')` (как в `Button`)
  — без новых зависимостей.

### 3. Уборка и README

- Убери комментарии `TODO(часть 2)`.
- Обнови `README.md`: заголовок «ДЗ №3 (React + TypeScript + CSS Modules)», стек,
  раздел «Структура» под новое дерево `src/` (папки `api`, `data`, `hooks`, `utils`,
  `styles`, `components/*` — по строке на файл/папку), упомяни `npm run typecheck`.
  Разделы «Участники», «Проверка состояний», «Деплой» оставь.
- Удали этот файл `HW3_PART2_PROMPT.md`.

## Правила

- TypeScript строгий: **никаких `any`**, `@ts-ignore`, `as unknown as`. Пропсы — через
  `interface`. Импорты с расширением `.ts`/`.tsx`, типы — `import type`
  (включён `verbatimModuleSyntax`).
- Только CSS Modules: никаких глобальных классов, инлайн-стилей (кроме исключительных
  случаев), Tailwind и CSS-in-JS. Цвета — через переменные из `global.css`
  (кроме фиксированных цветов неба/силуэтов, как в ДЗ №2).
- Не добавляй npm-зависимостей (`clsx` и т. п. не нужны).
- Не трогай `src/api`, `src/hooks`, `src/data`, `src/types.ts`, `vite.config.ts`,
  `tsconfig.json`, деплой — если без этого никак, объясни почему.
- Комментарии в коде — по-русски, коротко, как в остальном проекте.

## Как проверить, что готово

1. `npm install`, затем `npm run build` — без ошибок TypeScript и сборки.
2. `npm run dev`, открыть http://localhost:5173 и сравнить с опубликованной версией ДЗ №2
   https://redukeee-hse.github.io/mountain-weather/ — внешний вид и поведение должны совпадать:
   - карточки с небом, силуэтом, цветной температурой; ночью небо тёмное;
   - поиск «эльбрус» срабатывает через ~300 мс после ввода и сразу по Enter;
   - фильтр «Кавказ» → 4 вершины; «Сбросить» появляется и всё очищает;
   - «Обновить» неактивна и крутится во время загрузки (`?delay=3000`);
   - `?fail` → ошибка и «Повторить»; запрос `qwerty` → «Ничего не найдено»;
   - ширина 375 px — без горизонтальной прокрутки; тёмная тема системы работает.
3. В консоли браузера нет ошибок и предупреждений React (в т. ч. про `key`).
4. Закоммитить и отправить в ту же ветку, что и часть 1.
