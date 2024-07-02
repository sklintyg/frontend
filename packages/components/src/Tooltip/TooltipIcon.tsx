import type { ReactElement } from 'react'
import { cloneElement } from 'react'
import { Tooltip } from './Tooltip'
import { TooltipContent } from './TooltipContent'
import { TooltipTrigger } from './TooltipTrigger'

export function TooltipIcon({
  description,
  icon,
  alignMiddle = false,
}: {
  description: string
  icon: ReactElement
  alignMiddle?: boolean
}) {
  return (
    <Tooltip>
      <TooltipTrigger alignMiddle={alignMiddle}>{cloneElement(icon, { tabIndex: 0 })}</TooltipTrigger>
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  )
}
