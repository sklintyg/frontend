import type { ReactNode } from 'react'
import { ThemeContext } from '../ThemeContext'

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext.Provider value="1177-pro">{children}</ThemeContext.Provider>
}
