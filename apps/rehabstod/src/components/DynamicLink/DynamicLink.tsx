import { Icon } from '@frontend/components'
import { IDSLink } from '@inera/ids-react'
import type { ComponentProps } from 'react'
import type { Link } from '../../schemas'

export function DynamicLink({
  arrow,
  link,
  ...props
}: {
  link?: Link
  arrow?: boolean
} & Omit<ComponentProps<typeof IDSLink>, 'children'>) {
  if (link == null) {
    return null
  }

  const { url, target, text } = link

  const external = target === '_blank'

  return (
    <IDSLink {...props}>
      <a href={url} target={target} rel={target === '_blank' ? 'noreferrer' : undefined}>
        {arrow && <Icon icon="arrow-right-small" textStart />}
        {text}
        {external && <Icon icon="external-link-small" textEnd />}
      </a>
    </IDSLink>
  )
}
