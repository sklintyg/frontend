import { IDSHeader1177 } from '@inera/ids-react'
import type { ReactNode } from 'react'
import { getNavigationItem, getNavigationItemUrl } from '../navigation'
import { LayoutDesktopNav } from './LayoutDesktopNav'
import { LayoutMobileMenu } from './LayoutMobileMenu'

export function LayoutHeader({
  activeLink,
  avatar,
  mode,
  skipToContent,
}: {
  activeLink?: string
  avatar: ReactNode
  mode: string
  skipToContent: string
}) {
  const startLinkItem = getNavigationItem('Start')

  return (
    <IDSHeader1177
      avatar={avatar}
      hideRegionPicker
      logo={startLinkItem && getNavigationItemUrl(startLinkItem, mode)}
      mobileMenu={<LayoutMobileMenu mode={mode} activeLink={activeLink} />}
      skipToContentLink={<a href={skipToContent}>Till sidans huvudinnehåll</a>}
    >
      <LayoutDesktopNav mode={mode} activeLink={activeLink} />
    </IDSHeader1177>
  )
}
