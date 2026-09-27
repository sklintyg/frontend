import type { PayloadAction } from '@reduxjs/toolkit'
import { updateDarkMode } from '../store/slices/settings.slice'

interface DarkModeStore {
  getState: () => { settings: { darkMode: boolean } }
  dispatch: (action: PayloadAction<boolean>) => unknown
  subscribe: (listener: () => void) => () => void
}

export const applyDarkMode = (darkMode: boolean) => {
  document.body.classList.toggle('ids--dark', darkMode)
  document.body.classList.toggle('ids--light', !darkMode)
}

export const syncDarkMode = (store: DarkModeStore) => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const onChange = (e: MediaQueryListEvent) => {
    store.dispatch(updateDarkMode(e.matches))
  }

  applyDarkMode(mediaQuery.matches)

  const unsubscribe = store.subscribe(() => {
    applyDarkMode(store.getState().settings.darkMode)
  })

  mediaQuery.addEventListener('change', onChange)

  return () => {
    unsubscribe()
    mediaQuery.removeEventListener('change', onChange)
  }
}
