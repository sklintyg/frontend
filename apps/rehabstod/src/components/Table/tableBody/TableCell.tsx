/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { ReactNode } from 'react'
import { classNames } from '../../../utils/classNames'
import { Tooltip } from '../../Tooltip/Tooltip'
import { TooltipContent } from '../../Tooltip/TooltipContent'
import { TooltipTrigger } from '../../Tooltip/TooltipTrigger'

export function TableCell({
  description,
  children,
  sticky,
  ...props
}: {
  children: ReactNode
  description?: ReactNode
  sticky?: 'left' | 'top' | 'right'
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <td
          tabIndex={description ? 0 : undefined}
          {...props}
          className={classNames(
            'border-l-0',
            sticky != null && `sticky z-20`,
            classNames(sticky === 'right' && 'right-0', sticky === 'left' && 'left-0', sticky === 'top' && 'top-0')
          )}
        >
          {children}
        </td>
      </TooltipTrigger>
      {description && <TooltipContent>{description}</TooltipContent>}
    </Tooltip>
  )
}
