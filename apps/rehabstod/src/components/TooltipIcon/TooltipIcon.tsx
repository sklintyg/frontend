import { IDSIcon, IDSTooltip } from '@frontend/ids-react-ts'
import { ComponentProps } from 'react'

export function TooltipIcon({ description, ...iconProps }: { description: string } & ComponentProps<typeof IDSIcon>) {
  return (
    <IDSTooltip>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <IDSIcon slot="trigger" colorpreset={1} {...iconProps} tabIndex={0} />
      <div slot="tooltip">{description}</div>
    </IDSTooltip>
  )
}
