import type { PayloadAction } from '@reduxjs/toolkit'
import { updateDarkMode } from '../store/slices/settings.slice'

interface DarkModeStore {
  getState: () => { settings: { darkMode: boolean } }
  dispatch: (action: PayloadAction<boolean>) => unknown
  subscribe: (listener: () => void) => () => void
}

const applyDarkMode = (darkMode: boolean) => {
  document.body.classList.toggle('ids--dark', darkMode)
  document.body.classList.toggle('ids--light', !darkMode)
}

export const syncDarkMode = (store: DarkModeStore) => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  let osDarkMode = mediaQuery.matches
  let printing = false

  // Print in light mode, whatever the chosen theme
  const render = () => {
    applyDarkMode(!printing && store.getState().settings.darkMode)
  }

  // Chrome evaluates prefers-color-scheme as light while the print preview is open, and changes it
  // back after afterprint. Only a real change of the OS appearance should reach the store.
  const onChange = (e: MediaQueryListEvent) => {
    if (printing || e.matches === osDarkMode) {
      return
    }
    osDarkMode = e.matches
    store.dispatch(updateDarkMode(e.matches))
  }

  const onBeforePrint = () => {
    printing = true
    render()
  }

  const onAfterPrint = () => {
    printing = false
    render()
  }

  applyDarkMode(mediaQuery.matches)

  const unsubscribe = store.subscribe(render)

  mediaQuery.addEventListener('change', onChange)
  window.addEventListener('beforeprint', onBeforePrint)
  window.addEventListener('afterprint', onAfterPrint)

  return () => {
    unsubscribe()
    mediaQuery.removeEventListener('change', onChange)
    window.removeEventListener('beforeprint', onBeforePrint)
    window.removeEventListener('afterprint', onAfterPrint)
  }
}
