import { getResourceLink } from '../../store/certificate/certificateSelectors'
import { useAppSelector } from '../../store/store'
import { ResourceLink, ResourceLinkType } from '../../types'

function WithStoreResourceLink({ type, children }: { type: ResourceLinkType; children: (link: ResourceLink) => JSX.Element }) {
  const link = useAppSelector(getResourceLink(type))
  return link ? children(link) : null
}

export function WithResourceLink({
  type,
  links,
  children,
}: {
  type: ResourceLinkType
  links?: ResourceLink[]
  children: (link: ResourceLink) => JSX.Element
}) {
  if (!links) {
    return <WithStoreResourceLink type={type}>{(link) => children(link)}</WithStoreResourceLink>
  }
  const link = links.find((link) => link.type === type)
  return link ? children(link) : null
}
