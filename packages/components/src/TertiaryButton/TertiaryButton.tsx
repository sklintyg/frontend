import type { IDSIcon } from '@frontend/ids-react-ts'
import '@inera/ids-design/components/link/link.css'
import type { ComponentProps, ReactNode } from 'react'
import { forwardRef, useContext } from 'react'
import { ThemeContext } from '../theme/ThemeContext'
import { classNames } from '../utils'

interface TertiaryButtonProps {
  startIcon?: ReactNode
  endIcon?: ReactNode
  iconSize?: ComponentProps<IDSIcon>['size']
  underlined?: boolean
}

export const TertiaryButton = forwardRef<HTMLButtonElement, React.HTMLProps<HTMLButtonElement> & TertiaryButtonProps>(
  ({ startIcon, endIcon, underlined = false, children, className, ...props }, ref) => {
    const theme = useContext(ThemeContext)
    return (
      <button
        ref={ref}
        {...props}
        type="button"
        className={classNames(
          'ids-link inline-flex text-base font-normal',
          underlined && 'ids-link--underlined',
          theme === 'inera-admin' && 'uppercase',
          className ?? false
        )}
      >
        {startIcon}
        <span className="ids-link__text">{children}</span>
        {endIcon}
      </button>
    )
  }
)

TertiaryButton.displayName = 'TertiaryButton'
