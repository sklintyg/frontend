import type { ReactNode } from 'react'
import { forwardRef } from 'react'
import { classNames } from '../../utils/classNames'

interface TertiaryButtonProps {
  startIcon?: ReactNode
  endIcon?: ReactNode
  iconSize?: 'xs' | 's' | 'm'
  underlined?: boolean
}

export const TertiaryButton = forwardRef<HTMLButtonElement, React.HTMLProps<HTMLButtonElement> & TertiaryButtonProps>(
  ({ startIcon, endIcon, underlined = true, children, className, ...props }, ref) => (
    <button
      ref={ref}
      {...props}
      type="button"
      className={classNames('ids-link inline-flex text-base font-normal', underlined && 'ids-link--underlined', className ?? false)}
    >
      {startIcon}
      <span className="ids-link__text">{children}</span>
      {endIcon}
    </button>
  )
)

TertiaryButton.displayName = 'TertiaryButton'
