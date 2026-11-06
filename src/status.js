/**
 * Состояния приложения: загрузка, пустой результат, ошибка с повтором.
 * Всё выводится в контейнер #status (aria-live — экранные дикторы озвучат смену).
 */

/** @param {HTMLElement} container */
export function showLoading(container) {
  container.dataset.state = 'loading'
  container.innerHTML = `
    <div class="status-box status-box--loading" role="status">
      <span class="spinner" aria-hidden="true"></span>
      <span>Загрузка…</span>
    </div>`
}

/** @param {HTMLElement} container */
export function showEmpty(container) {
  container.dataset.state = 'empty'
  container.innerHTML = `
    <div class="status-box status-box--empty" role="status">
      <strong>Ничего не найдено</strong>
      <span>Такой вершины нет в каталоге. Измените запрос или выберите другую горную систему.</span>
    </div>`
}

/**
 * @param {HTMLElement} container
 * @param {string} message понятный пользователю текст ошибки
 * @param {() => void} onRetry что сделать по кнопке «Повторить»
 */
export function showError(container, message, onRetry) {
  container.dataset.state = 'error'

  const box = document.createElement('div')
  box.className = 'status-box status-box--error'
  box.setAttribute('role', 'alert')

  const title = document.createElement('strong')
  title.textContent = 'Не удалось загрузить данные'

  const text = document.createElement('span')
  text.textContent = message

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'button button--primary'
  button.textContent = 'Повторить'
  button.addEventListener('click', onRetry, { once: true })

  box.append(title, text, button)
  container.replaceChildren(box)
  button.focus()
}

/** @param {HTMLElement} container */
export function clearStatus(container) {
  container.dataset.state = 'ready'
  container.replaceChildren()
}
