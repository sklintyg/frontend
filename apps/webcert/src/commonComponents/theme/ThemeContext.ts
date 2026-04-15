import { createContext } from 'react'

export type IDSTheme = '1177' | '1177-pro' | 'inera' | 'inera-admin'

export const ThemeContext = createContext<IDSTheme>('1177')
