import { forwardRef } from 'react'
import { classNames } from '../utils'

interface LinkButtonProps {
  secondary?: boolean
}

/**
 * Component for creating a link that looks like a button.
 * Requires ids-design button css '@inera/ids-design/components/button/button.css'
 */
export const LinkButton = forwardRef<HTMLAnchorElement, React.HTMLProps<HTMLAnchorElement> & LinkButtonProps>(
  ({ secondary, children, className, ...props }, ref) => (
    <a
      ref={ref}
      {...props}
      className={classNames('ids-button  no-underline', secondary === true && 'ids-button--secondary', className ?? false)}
    >
      {children}
    </a>
  )
)

LinkButton.displayName = 'LinkButton'
