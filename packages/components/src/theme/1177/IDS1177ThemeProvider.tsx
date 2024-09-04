import '@inera/ids-design/themes/1177/1177.css'
import type { ReactNode } from 'react'
import { ThemeContext } from '../ThemeContext'

export function IDS1177ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext.Provider value="1177">{children}</ThemeContext.Provider>
}
