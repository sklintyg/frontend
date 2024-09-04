import '@inera/ids-design/themes/1177-pro/1177-pro.css'
import type { ReactNode } from 'react'
import { ThemeContext } from '../ThemeContext'

export function IDS1177ProThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext.Provider value="1177-pro">{children}</ThemeContext.Provider>
}
