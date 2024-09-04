import '@inera/ids-design/themes/inera/inera.css'
import type { ReactNode } from 'react'
import { ThemeContext } from '../ThemeContext'

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext.Provider value="inera">{children}</ThemeContext.Provider>
}
