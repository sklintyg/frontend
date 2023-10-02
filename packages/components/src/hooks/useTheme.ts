import { useEffect } from 'react'
import { themes } from '../themes'

export const useTheme = (theme: keyof typeof themes) => {
  useEffect(() => {
    const themeObject = themes[theme]
    if (!themeObject) return

    const root = document.documentElement
    if (root) {
      Object.entries(themeObject).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value)
      })
    }
  }, [theme])
}
