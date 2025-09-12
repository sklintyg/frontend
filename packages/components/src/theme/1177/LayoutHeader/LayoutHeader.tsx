import { IDSHeader1177 } from '@inera/ids-react'
import type { ReactNode } from 'react'
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
  links: Array<{ id: string; name: string; url: string }>
  skipToContent: string
}) {
  const startLinkItem = links.find((link) => link.name === 'Start')

  return (
    <IDSHeader1177
      avatar={avatar}
      hideRegionPicker
      logoHref={startLinkItem?.url}
      mobileMenu={<LayoutMobileMenu links={links} activeLink={activeLink} />}
      skipToContentLink={<a href={skipToContent}>Till sidans huvudinnehåll</a>}
    >
      <LayoutDesktopNav links={links} activeLink={activeLink} />
    </IDSHeader1177>
  )
}
