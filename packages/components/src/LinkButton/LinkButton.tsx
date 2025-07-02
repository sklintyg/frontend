import '@inera/ids-design/components/button/button.css'
import { forwardRef } from 'react'
import { classNames } from '../utils'

interface LinkButtonProps {
  secondary?: boolean
  block?: boolean
  sBlock?: boolean
  mBlock?: boolean
}

export const LinkButton = forwardRef<HTMLAnchorElement, React.HTMLProps<HTMLAnchorElement> & LinkButtonProps>(
  ({ secondary, block = false, sBlock = false, mBlock = false, children, className, ...props }, ref) => (
    <a
      ref={ref}
      {...props}
      className={classNames(
        'ids-button  no-underline',
        secondary === true && 'ids-button--secondary',
        block && 'ids-button--block',
        sBlock && 'ids-button--s-block',
        mBlock && 'ids-button--m-block',
        className ?? false
      )}
    >
      {children}
    </a>
  )
)

LinkButton.displayName = 'LinkButton'
