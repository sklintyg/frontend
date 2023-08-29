import { cloneElement, ReactNode } from 'react'
import { Tooltip } from '../Tooltip/Tooltip'
import { TooltipContent } from '../Tooltip/TooltipContent'
import { TooltipTrigger } from '../Tooltip/TooltipTrigger'

export function TooltipIcon({ description, icon, alignMiddle = false }: { description: string; icon: ReactNode; alignMiddle?: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger alignMiddle={alignMiddle}>{cloneElement(icon, { tabIndex: 0 })}</TooltipTrigger>
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  )
}
