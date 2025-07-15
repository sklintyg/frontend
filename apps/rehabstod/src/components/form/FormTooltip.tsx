/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { useId, type ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip'

export function FormTooltip({ children }: { children: ReactNode }) {
  const id = useId()

  return (
    <Tooltip placement="bottom-start">
      <TooltipTrigger>
        <span className="ids-icon-information ids-icon--m ids-icon--color-preset-1" aria-labelledby={id} tabIndex={0} />
      </TooltipTrigger>
      <TooltipContent id={id}>{children}</TooltipContent>
    </Tooltip>
  )

  // return (
  //   <IDSTooltip slot="tooltip" position="bottom-left">
  //     <span className="ids-icon-information ids-icon--m ids-icon--color-preset-1" aria-labelledby={id} slot="trigger" tabIndex={0} />
  //     <div id={id} className="max-w-md">
  //       {children}
  //     </div>
  //   </IDSTooltip>
  // )
}
