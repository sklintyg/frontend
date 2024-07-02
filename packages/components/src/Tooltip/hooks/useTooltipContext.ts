import { createContext, useContext } from 'react'
import type { useTooltip } from './useTooltip'

export const TooltipContext = createContext<ReturnType<typeof useTooltip> | null>(null)

export const useTooltipContext = () => {
  const context = useContext(TooltipContext)

  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />')
  }

  return context
}
