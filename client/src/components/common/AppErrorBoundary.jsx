import { Component } from 'react'
import { clearChunkReloadAttempt, shouldAttemptChunkReload } from '../../utils/chunkRecovery.js'

const sessionStorageIfAvailable = () => {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

class AppErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Application render failed', error, info)

    if (shouldAttemptChunkReload(
      error,
      sessionStorageIfAvailable(),
      window.location.pathname,
    )) {
      window.location.reload()
    }
  }

  reload = () => {
    clearChunkReloadAttempt(
      this.state.error,
      sessionStorageIfAvailable(),
      window.location.pathname,
    )
    window.location.reload()
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
        <section
          className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-7 text-center shadow-sm"
          role="alert"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-2xl text-brand-600">
            !
          </div>
          <h1 className="text-2xl font-bold text-charcoal-900">This page couldn&apos;t load</h1>
          <p className="mt-3 text-sm leading-6 text-charcoal-600">
            The website may have just been updated or your connection was interrupted. Reload to get the latest version.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
              onClick={this.reload}
            >
              Reload page
            </button>
            <a
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-charcoal-800 hover:bg-slate-50"
              href="/"
            >
              Return home
            </a>
          </div>
        </section>
      </main>
    )
  }
}

export default AppErrorBoundary
