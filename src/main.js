import './style.css'
import './ui.css'
import { ApiError, fetchMountains, getCategories } from './api.js'
import { setupControls } from './controls.js'
import { renderMountains } from './render.js'
import { clearStatus, showEmpty, showError, showLoading } from './status.js'

const controlsEl = document.querySelector('#controls')
const statusEl = document.querySelector('#status')
const resultsEl = document.querySelector('#results')

/** Текущие параметры запроса. Меняются через элементы управления. */
const state = {
  query: '',
  category: '',
}

/** Контроллер текущего запроса: новый запрос отменяет старый. */
let currentRequest = null

const controls = setupControls(controlsEl, {
  onSearch(query) {
    state.query = query.trim()
    loadMountains()
  },
  onCategoryChange(category) {
    state.category = category
    loadMountains()
  },
  onRefresh() {
    loadMountains()
  },
  onReset() {
    state.query = ''
    state.category = ''
    loadMountains()
  },
})

async function loadMountains() {
  currentRequest?.abort()
  const request = new AbortController()
  currentRequest = request

  resultsEl.replaceChildren()
  showLoading(statusEl)
  controls.setBusy?.(true)

  try {
    const mountains = await fetchMountains({ ...state, signal: request.signal })
    if (request.signal.aborted) return

    if (mountains.length === 0) {
      showEmpty(statusEl)
    } else {
      clearStatus(statusEl)
      renderMountains(resultsEl, mountains)
    }
  } catch (error) {
    if (error.name === 'AbortError') return
    console.error(error)
    showError(statusEl, getErrorMessage(error), loadMountains)
  } finally {
    if (currentRequest === request) controls.setBusy?.(false)
  }
}

/** @param {unknown} error */
function getErrorMessage(error) {
  if (error instanceof ApiError) return error.message
  return 'Произошла непредвиденная ошибка. Попробуйте ещё раз.'
}

controls.setCategories(getCategories())
loadMountains()
