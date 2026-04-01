const DARK_MODE_STORAGE_KEY = 'minaintyg.darkMode'

export const readDarkModePreference = () => {
  const value = sessionStorage.getItem(DARK_MODE_STORAGE_KEY)
  return value === 'true'
}

export const saveDarkModePreference = (darkMode: boolean) => {
  sessionStorage.setItem(DARK_MODE_STORAGE_KEY, String(darkMode))
}

export const applyDarkMode = (darkMode: boolean) => {
  document.body.classList.toggle('ids--dark', darkMode)
  document.body.classList.toggle('ids--light', !darkMode)
}
