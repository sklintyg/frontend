import type { LabelHTMLAttributes } from 'react'
import { forwardRef, useId } from 'react'
import { Tooltip } from '../../Tooltip/Tooltip'
import { TooltipContent } from '../../Tooltip/TooltipContent'
import { TooltipTrigger } from '../../Tooltip/TooltipTrigger'
import { classNames } from '../../utils/classNames'

interface InputLabelProps {
  description?: string
  disabled?: boolean
  inline?: boolean
}

export const InputLabel = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement> & InputLabelProps>(
  ({ children, description, inline, disabled, ...props }, ref) => {
    const id = useId()
    const label = (
      <label ref={ref} className={classNames('ids-label min-w-[auto]', inline && 'm-0', disabled && 'ids-label--disabled')} {...props}>
        {children}
      </label>
    )

    return (
      <div className="ids-label-tooltip-wrapper">
        {label}
        {description && (
          <Tooltip placement="bottom-start">
            <TooltipTrigger>
              <span role="button" className="ids-icon-information ids-icon--m ids-icon--color-preset-1" aria-labelledby={id} tabIndex={0} />
            </TooltipTrigger>
            <TooltipContent id={id}>{description}</TooltipContent>
          </Tooltip>
        )}
      </div>
    )
  }
)

InputLabel.displayName = 'InputLabel'
