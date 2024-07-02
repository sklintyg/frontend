import type React from 'react'
import { createContext } from 'react'

export const DatePickerBoundryContext = createContext<React.RefObject<HTMLElement> | undefined>(undefined)
