import { ReactNode } from 'react'
import { TooltipOptions, useTooltip } from './hooks/useTooltip'
import { TooltipContext } from './hooks/useTooltipContext'

export function Tooltip({ children, ...options }: { children: ReactNode } & TooltipOptions) {
  const tooltip = useTooltip(options)
  return <TooltipContext.Provider value={tooltip}>{children}</TooltipContext.Provider>
}
