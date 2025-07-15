/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import type { LabelHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../Tooltip'

export const InputLabel = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement> & { description?: string }>(
  ({ children, description, ...props }, ref) => {
    const id = useId()
    const label = (
      <label ref={ref} className="ids-label" {...props}>
        {children}
      </label>
    )

    return description ? (
      <div className="ids-label-tooltip-wrapper">
        {label}
        <Tooltip placement="bottom-start">
          <TooltipTrigger>
            <span className="ids-icon-information ids-icon--m ids-icon--color-preset-1" aria-labelledby={id} tabIndex={0} />
          </TooltipTrigger>
          <TooltipContent id={id}>{description}</TooltipContent>
        </Tooltip>
      </div>
    ) : (
      label
    )
  }
)

InputLabel.displayName = 'InputLabel'
