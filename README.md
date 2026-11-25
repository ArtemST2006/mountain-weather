# Погода на вершинах — ДЗ №3 (React + TypeScript + CSS Modules)

Одностраничное приложение на **Vite 8, React 19, TypeScript и CSS Modules**: каталог высочайших гор мира
(Гималаи, Каракорум, Кавказ, Альпы, Анды…) с **текущей погодой прямо на высоте вершины**.
Можно искать вершину, выбирать горную систему и обновлять данные.

- **Сайт:** https://redukeee-hse.github.io/mountain-weather/
- **Репозиторий:** https://github.com/redukeee-hse/mountain-weather
- **API:** [Open-Meteo Forecast API](https://open-meteo.com/en/docs) (HTTPS, CORS, без ключа).
  Одним запросом приходит погода для всех выбранных вершин; параметр `elevation`
  пересчитывает температуру на высоту вершины.

## Участники

- Артемьев Денис — [@redukeee-hse](https://github.com/redukeee-hse)
- Степанов Артем — [@ArtemST2006](https://github.com/ArtemST2006)

## Возможности

- погода на вершине через `fetch` с проверкой `response.ok`: температура, «ощущается как», ветер и порывы, облачность, местное время;
- карточки с силуэтом горы и цветом неба по погоде и времени суток, цветовая шкала температуры;
- поиск по названию вершины или стране (с задержкой 300 мс и по Enter), выбор горной системы, кнопки «Обновить» и «Сбросить»;
- состояния: «Загрузка…», «Ничего не найдено», понятная ошибка с кнопкой «Повторить»;
- новый запрос отменяет предыдущий (`AbortController`), старые ответы не перетирают новые;
- светлая и тёмная тема по настройкам системы, адаптивная вёрстка до 375 px.

## Запуск и сборка

Нужен Node.js 20.19+ или 22.12+.

```bash
npm install       # установить зависимости
npm run dev       # сервер разработки: http://localhost:5173
npm run build     # production-сборка в папку dist/
npm run typecheck # проверка типов TypeScript
npm run preview   # локальный просмотр готовой сборки
```

## Проверка состояний

Параметры в адресе страницы (работают и на опубликованном сайте):

- `?delay=3000` — ответ приходит через 3 с → видно «Загрузка…»;
- `?fail` — запрос с неверными координатами, API отвечает 400 → видно ошибку и кнопку «Повторить»;
- поиск по несуществующему слову (например, `qwerty`) → «Ничего не найдено».

## Структура

```
index.html                         корневой элемент приложения
vite.config.ts                     base: './' для GitHub Pages
src/main.tsx                       точка входа React
src/types.ts                       типы вершин, погоды, фильтров и состояний
src/api/weather.ts                 запрос к Open-Meteo и обработка ошибок
src/data/mountains.ts              справочник вершин и горных систем
src/hooks/useMountains.ts          загрузка данных и отмена старых запросов
src/utils/format.ts                форматирование чисел и температуры
src/utils/weatherCodes.ts          описание погоды, тип неба и тон температуры
src/utils/ridge.ts                 контуры силуэта горы
src/styles/global.css              переменные темы и сброс
src/components/App/               состояние фильтров и раскладка
src/components/Hero/              шапка страницы
src/components/Controls/          поиск, фильтр и кнопки
src/components/Button/            общая кнопка
src/components/MountainList/      итог и сетка вершин
src/components/MountainCard/      карточка вершины и погодные показатели
src/components/StatusMessage/     загрузка, пустой результат и ошибка
src/components/Footer/            подвал
.github/workflows/deploy.yml      сборка и публикация при push в main
```

## Деплой

Публикация автоматическая: каждый push в ветку `main` запускает GitHub Actions,
который выполняет `npm ci && npm run build` и выкладывает `dist/` на GitHub Pages.
Однократная настройка: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
