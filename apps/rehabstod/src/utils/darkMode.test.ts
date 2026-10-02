import { configureStore } from '@reduxjs/toolkit'
import { settingsReducer, updateDarkMode } from '../store/slices/settings.slice'
import { syncDarkMode } from './darkMode'

const originalMatchMedia = window.matchMedia
let cleanup: () => void

function setup(osDarkMode: boolean) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>()
  const mediaQuery = {
    matches: osDarkMode,
    addEventListener: (_: string, listener: (e: MediaQueryListEvent) => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: (e: MediaQueryListEvent) => void) => listeners.delete(listener),
  }
  window.matchMedia = () => mediaQuery as unknown as MediaQueryList

  const store = configureStore({ reducer: { settings: settingsReducer } })
  store.dispatch(updateDarkMode(osDarkMode))
  cleanup = syncDarkMode(store)

  const darkMode = () => store.getState().settings.darkMode
  const change = (matches: boolean) => {
    mediaQuery.matches = matches
    listeners.forEach((listener) => listener({ matches } as MediaQueryListEvent))
  }
  const print = (event: 'beforeprint' | 'afterprint') => window.dispatchEvent(new Event(event))

  return { store, darkMode, change, print }
}

afterEach(() => {
  cleanup()
  window.matchMedia = originalMatchMedia
  document.body.className = ''
})

it('Should keep dark mode through the print preview when the OS is dark', () => {
  const { darkMode, change, print } = setup(true)

  print('beforeprint')
  expect(darkMode()).toBe(true)
  change(false)
  expect(darkMode()).toBe(true)
  change(false)
  expect(darkMode()).toBe(true)
  print('afterprint')
  expect(darkMode()).toBe(true)
  change(true)
  expect(darkMode()).toBe(true)
})

it('Should keep light mode chosen on a dark OS through the print preview', () => {
  const { store, darkMode, change, print } = setup(true)
  store.dispatch(updateDarkMode(false))

  print('beforeprint')
  change(false)
  change(false)
  print('afterprint')
  change(true)

  expect(darkMode()).toBe(false)
})

it('Should follow the OS appearance when it changes outside printing', () => {
  const { darkMode, change } = setup(true)

  change(false)
  expect(darkMode()).toBe(false)
  change(true)
  expect(darkMode()).toBe(true)
})

it('Should print in light mode without changing the chosen dark mode', () => {
  const { store, darkMode, print } = setup(false)
  store.dispatch(updateDarkMode(true))
  expect(document.body).toHaveClass('ids--dark')

  print('beforeprint')
  expect(document.body).toHaveClass('ids--light')
  expect(document.body).not.toHaveClass('ids--dark')
  expect(darkMode()).toBe(true)

  print('afterprint')
  expect(document.body).toHaveClass('ids--dark')
  expect(document.body).not.toHaveClass('ids--light')
  expect(darkMode()).toBe(true)
})

it('Should keep printing in light mode when the chosen theme changes during printing', () => {
  const { store, darkMode, print } = setup(false)
  store.dispatch(updateDarkMode(true))

  print('beforeprint')
  store.dispatch(updateDarkMode(false))
  expect(document.body).toHaveClass('ids--light')
  store.dispatch(updateDarkMode(true))
  expect(document.body).toHaveClass('ids--light')
  expect(document.body).not.toHaveClass('ids--dark')
  expect(darkMode()).toBe(true)

  print('afterprint')
  expect(document.body).toHaveClass('ids--dark')
  expect(document.body).not.toHaveClass('ids--light')
})
