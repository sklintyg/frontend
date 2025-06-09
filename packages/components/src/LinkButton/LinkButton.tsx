import { forwardRef } from 'react'
import { classNames } from '../utils'

interface LinkButtonProps {
  secondary?: boolean
  block?: boolean
  sblock?: boolean
  mblock?: boolean
}

export const LinkButton = forwardRef<HTMLAnchorElement, React.HTMLProps<HTMLAnchorElement> & LinkButtonProps>(
  ({ secondary, block = false, sblock = false, mblock = false, children, className, ...props }, ref) => (
    <a
      ref={ref}
      {...props}
      className={classNames(
        'ids-button  no-underline',
        secondary === true && 'ids-button--secondary',
        block && 'ids-button--block',
        sblock && 'ids-button--s-block',
        mblock && 'ids-button--m-block',
        className ?? false
      )}
    >
      {children}
    </a>
  )
)

LinkButton.displayName = 'LinkButton'
