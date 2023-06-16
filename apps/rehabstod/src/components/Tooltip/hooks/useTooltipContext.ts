import React from 'react'
import { useTooltip } from './useTooltip'

export const TooltipContext = React.createContext<ReturnType<typeof useTooltip> | null>(null)

export const useTooltipContext = () => {
  const context = React.useContext(TooltipContext)

  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />')
  }

  return context
}
