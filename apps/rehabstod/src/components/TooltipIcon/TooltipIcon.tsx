/* eslint-disable react/jsx-props-no-spreading */
import { IDSIcon } from '@frontend/ids-react-ts'
import { ComponentProps } from 'react'
import { Tooltip } from '../Tooltip/Tooltip'
import { TooltipContent } from '../Tooltip/TooltipContent'
import { TooltipTrigger } from '../Tooltip/TooltipTrigger'

export function TooltipIcon({ description, ...iconProps }: { description: string } & ComponentProps<typeof IDSIcon>) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  // return <Tooltip trigger={<IDSIcon colorpreset={1} {...iconProps} tabIndex={0} />}>{description}</Tooltip>
  return (
    <Tooltip>
      <TooltipTrigger>
        <IDSIcon colorpreset={1} {...iconProps} tabIndex={0} />
      </TooltipTrigger>
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  )
}
