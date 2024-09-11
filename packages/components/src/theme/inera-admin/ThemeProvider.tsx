import type { ReactNode } from 'react'
import { ThemeContext } from '../ThemeContext'
import './inera-admin.css'

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeContext.Provider value="inera-admin">{children}</ThemeContext.Provider>
}
