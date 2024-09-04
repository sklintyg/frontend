import type { ReactNode } from 'react'
import { ThemeContext } from '../ThemeContext'
import './1177.css'

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext.Provider value="1177">{children}</ThemeContext.Provider>
}
