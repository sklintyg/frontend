import { IDSHeader1177 } from '@inera/ids-react'
import type { ReactNode } from 'react'
import type { DynamicLink } from '../../../types'
import { LayoutDesktopNav } from './LayoutDesktopNav'
import { LayoutMobileMenu } from './LayoutMobileMenu'

export function LayoutHeader({
  activeLink,
  avatar,
  links,
  skipToContent,
}: {
  activeLink?: string
  avatar: ReactNode
  links: DynamicLink[]
  skipToContent: string
}) {
  const mappedLinks = links.map((link) => {
    if (link.name === 'Intyg') {
      return { ...link, url: '/' }
    }
    return link
  })

  const startLinkItem = links.find((link) => link.name === 'Start')

  return (
    <IDSHeader1177
      avatar={avatar}
      hideRegionPicker
      logoHref={startLinkItem?.url}
      mobileMenu={<LayoutMobileMenu links={mappedLinks} activeLink={activeLink} />}
      skipToContentLink={<a href={skipToContent}>Till sidans huvudinnehåll</a>}
    >
      <LayoutDesktopNav links={mappedLinks} activeLink={activeLink} />
    </IDSHeader1177>
  )
}
