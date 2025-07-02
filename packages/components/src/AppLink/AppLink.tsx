import type { ColorPreset } from '@inera/ids-react'
import { IDSLink } from '@inera/ids-react'
import type { HTMLAttributeAnchorTarget, ReactNode } from 'react'
import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../Icon'

export const AppLink = forwardRef<
  HTMLAnchorElement,
  {
    to: string
    children: ReactNode
    target?: HTMLAttributeAnchorTarget
    arrow?: boolean
    underlined?: boolean
    external?: boolean
    block?: boolean
    colorPreset?: ColorPreset
    large?: boolean
  } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>
>(({ to, target: incommingTarget, block, colorPreset, large, underlined, arrow, external, children, ...props }, ref) => {
  const target = incommingTarget || external ? '_blank' : undefined
  return (
    <IDSLink underlined={underlined} block={block} colorPreset={colorPreset} large={large}>
      {external || target != null ? (
        <a ref={ref} href={to} target={target} rel={target === '_blank' ? 'noreferrer' : undefined} {...props}>
          {arrow && <Icon icon="arrow-right-small" />}
          {children}
          <Icon icon="external-link-small" />
        </a>
      ) : (
        <Link ref={ref} to={to}>
          {arrow && <Icon icon="arrow-right-small" />}
          {children}
        </Link>
      )}
    </IDSLink>
  )
})

AppLink.displayName = 'Heading'
