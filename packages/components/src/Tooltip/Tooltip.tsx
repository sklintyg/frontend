import type { ReactNode } from 'react'
import type { TooltipOptions} from './hooks/useTooltip';
import { useTooltip } from './hooks/useTooltip'
import { TooltipContext } from './hooks/useTooltipContext'

export function Tooltip({ children, ...options }: { children: ReactNode } & TooltipOptions) {
  const tooltip = useTooltip(options)
  return <TooltipContext.Provider value={tooltip}>{children}</TooltipContext.Provider>
}
