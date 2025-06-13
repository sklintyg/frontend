/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import type { ReactNode } from 'react'
import { classNames } from '../../../utils/classNames'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../Tooltip'

export function TableCell({
  description,
  children,
  sticky,
  colSpan,
  ...props
}: {
  children: ReactNode
  description?: ReactNode
  sticky?: 'left' | 'top' | 'right'
  colSpan?: number
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <td
          tabIndex={description ? 0 : undefined}
          style={{ borderBottom: '.063rem solid var(--IDS-DATA-TABLE__CELL-BORDER_COLOR)' }}
          {...props}
          className={classNames(
            'group-last:border-b-0',
            'text-left bg-white p-2 first:p-4 last:p-4',
            sticky != null && `sticky z-10`,
            sticky === 'right' && 'right-0',
            sticky === 'left' && 'left-0',
            sticky === 'top' && 'top-0'
          )}
          colSpan={colSpan}
        >
          {children}
        </td>
      </TooltipTrigger>
      {description && <TooltipContent>{description}</TooltipContent>}
    </Tooltip>
  )
}
