import { IDSIcon } from '@frontend/ids-react-ts'
import { ComponentProps } from 'react'
import { Tooltip } from '../Tooltip/Tooltip'
import { TooltipContent } from '../Tooltip/TooltipContent'
import { TooltipTrigger } from '../Tooltip/TooltipTrigger'

export function TooltipIcon({ description, ...iconProps }: { description: string } & ComponentProps<typeof IDSIcon>) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <IDSIcon colorpreset={1} tabIndex={0} {...iconProps} />
      </TooltipTrigger>
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  )
}
