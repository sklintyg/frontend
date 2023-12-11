import { IDSIcon } from '@frontend/ids-react-ts'
import { forwardRef } from 'react'
import { LinkIcon } from '../LinkIcon'
import { classNames } from '../utils'

interface TertiaryButtonProps {
  startIcon?: IDSIcon
  endIcon?: IDSIcon
}

/**
 * Component for when a tertiary button needs to be truly tertiary without hover-effect and padding.
 * Requires ids-design link css '@inera/ids-design/components/link/link.css'
 */
export const TertiaryButton = forwardRef<HTMLButtonElement, React.HTMLProps<HTMLButtonElement> & TertiaryButtonProps>(
  ({ startIcon, endIcon, children, className, ...props }, ref) => (
    <button
      ref={ref}
      {...props}
      type="button"
      className={classNames('ids-link uppercase text-base font-normal underline', className ?? false)}
    >
      {startIcon && <LinkIcon icon={startIcon} />}
      <span className="ids-link__text">{children}</span>
      {endIcon && <LinkIcon icon={endIcon} />}
    </button>
  )
)

TertiaryButton.displayName = 'TertiaryButton'
