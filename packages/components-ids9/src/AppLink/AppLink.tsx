import type { ColorPreset } from '@inera/ids-react'
import { IDSLink } from '@inera/ids-react'
import type { HTMLAttributeAnchorTarget, ReactNode } from 'react'
import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../Icon/Icon'

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
    footer?: boolean
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
      footer,
      largeArrow = false,
      children,
      ...props
    },
    ref
  ) => {
    const target = incommingTarget || (external ? '_blank' : undefined)
    return (
      <IDSLink underlined={underlined} block={block} colorPreset={colorPreset} footer={footer} small={small}>
        {external || target != null ? (
          <a ref={ref} href={to} target={target} rel={target === '_blank' ? 'noreferrer' : undefined} {...props}>
            {arrow && <Icon icon="arrow-right-small" textStart />}
            {children}
            {target !== 'self' && <Icon icon="external-link-small" textEnd />}
          </a>
        ) : (
          <Link ref={ref} to={to}>
            {arrow && <Icon data-testid="arrow" icon={largeArrow ? 'arrow-right' : 'arrow-right-small'} textStart />}
            {children}
          </Link>
        )}
      </IDSLink>
    )
  }
)

AppLink.displayName = 'Heading'
