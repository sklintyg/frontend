import { getByType } from 'utils'
import { getCertificateResourceLink } from '../../store/certificate/certificateSelectors'
import { useAppSelector } from '../../store/store'
import { getUserResourceLink } from '../../store/user/userSelectors'
import type { ResourceLink, ResourceLinkType } from '../../types'

interface Props {
  type: ResourceLinkType
  children: (link: ResourceLink) => JSX.Element
}

export function WithCertificateResourceLink({ type, children }: Props) {
  const link = useAppSelector(getCertificateResourceLink(type))
  return link ? children(link) : null
}

export function WithUserResourceLink({ type, children }: Props) {
  const link = useAppSelector(getUserResourceLink(type))
  return link ? children(link) : null
}

export function WithResourceLink({
  type,
  links,
  children,
}: Props & {
  links: ResourceLink[]
}) {
  const link = getByType(links, type)
  return link ? children(link) : null
}
