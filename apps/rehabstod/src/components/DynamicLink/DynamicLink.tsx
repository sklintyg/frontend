/* eslint-disable react/jsx-props-no-spreading */
import { IDSIcon, IDSLink } from '@frontend/ids-react-ts'
import { ComponentProps } from 'react'
import { Link } from '../../store/types/link'

export function DynamicLink({
  text,
  className,
  link: { url, target, ...link },
  ...props
}: { link: Link; text?: string; className?: HTMLAnchorElement['className'] } & ComponentProps<typeof IDSLink>) {
  return (
    <IDSLink {...props}>
      <a href={url} target={target} className={className} rel={target === '_blank' ? 'noreferrer' : undefined}>
        {text != null ? text : link.text}
      </a>
      {target === '_blank' && <IDSIcon slot="append-icon" name="external" />}
    </IDSLink>
  )
}
