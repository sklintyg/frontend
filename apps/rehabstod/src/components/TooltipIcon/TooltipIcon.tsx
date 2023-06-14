import { ReactNode } from 'react'
import { Tooltip } from '../Tooltip/Tooltip'
import { TooltipContent } from '../Tooltip/TooltipContent'
import { TooltipTrigger } from '../Tooltip/TooltipTrigger'

export function TooltipIcon({ description, icon }: { description: string; icon: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger>{icon}</TooltipTrigger>
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  )
}
