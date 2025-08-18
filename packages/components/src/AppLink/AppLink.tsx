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
    small?: boolean
    largeIcon?: boolean
    largeArrow?: boolean
  } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>
>(
  (
    {
      to,
      target: incommingTarget,
      block,
      colorPreset,
      large,
      underlined = false,
      arrow,
      external,
      small,
      largeIcon = false,
      largeArrow = false,
      children,
      ...props
    },
    ref
  ) => {
    const target = incommingTarget || (external ? '_blank' : undefined)
    return (
      <IDSLink
        underlined={underlined}
        noUnderline={underlined != null ? !underlined : undefined}
        block={block}
        colorPreset={colorPreset}
        large={large}
        small={small}
      >
        {external || target != null ? (
          <a ref={ref} href={to} target={target} rel={target === '_blank' ? 'noreferrer' : undefined} {...props}>
            {arrow && <Icon icon="arrow-right-small" textStart />}
            {children}
            {target !== 'self' && <Icon icon={largeIcon ? 'external-link' : 'external-link-small'} textEnd />}
          </a>
        ) : (
          <Link ref={ref} to={to}>
            {arrow && <Icon icon={largeArrow ? 'arrow-right' : 'arrow-right-small'} textStart />}
            {children}
          </Link>
        )}
      </IDSLink>
    )
  }
)

AppLink.displayName = 'Heading'
