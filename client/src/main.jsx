import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppErrorBoundary from './components/common/AppErrorBoundary.jsx'
import { clearChunkReloadGuard, shouldAttemptChunkReload } from './utils/chunkRecovery.js'
import { initializeMonitoring, markRouteTransitionStart } from './utils/monitoring.js'

initializeMonitoring()

document.addEventListener('click', (event) => {
  const link = event.target.closest?.('a[href]')
  if (!link) return
  const destination = new URL(link.href, window.location.href)
  if (destination.origin === window.location.origin && destination.pathname !== window.location.pathname) {
    markRouteTransitionStart(destination.pathname)
  }
}, { capture: true })

const sessionStorageIfAvailable = () => {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

window.addEventListener('vite:preloadError', (event) => {
  if (shouldAttemptChunkReload(
    event.payload,
    sessionStorageIfAvailable(),
    window.location.pathname,
  )) {
    event.preventDefault()
    window.location.reload()
  }
})

// A stable page clears the guard so a later deployment can recover in the same tab.
window.setTimeout(() => {
  clearChunkReloadGuard(sessionStorageIfAvailable(), window.location.pathname)
}, 30_000)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
)
