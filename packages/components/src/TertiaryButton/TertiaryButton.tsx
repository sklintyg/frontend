import type { ReactNode } from 'react'
import { forwardRef } from 'react'
import { classNames } from '../utils/classNames'

interface TertiaryButtonProps {
  startIcon?: ReactNode
  endIcon?: ReactNode
  iconSize?: 'xs' | 's' | 'm'
  underlined?: boolean
  colorPreset?: number
  small?: boolean
}

export const TertiaryButton = forwardRef<HTMLButtonElement, React.HTMLProps<HTMLButtonElement> & TertiaryButtonProps>(
  ({ startIcon, endIcon, underlined = true, colorPreset, small, children, className, ...props }, ref) => (
    <button
      ref={ref}
      {...props}
      type="button"
      className={classNames(
        'ids-link inline-flex font-normal items-center',
        underlined && 'ids-link--underlined',
        typeof colorPreset === 'number' && `ids-link--color-${colorPreset}`,
        colorPreset === 4 && 'ids-link--light',
        small ? 'ids-link--small' : 'text-base',
        className ?? false
      )}
    >
      {startIcon}
      <span className="ids-link__text">{children}</span>
      {endIcon}
    </button>
  )
)

TertiaryButton.displayName = 'TertiaryButton'
