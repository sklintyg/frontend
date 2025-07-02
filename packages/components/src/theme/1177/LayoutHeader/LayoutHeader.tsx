import { IDSHeader1177 } from '@inera/ids-react'
import { getNavigationItem, getNavigationItemUrl } from '../navigation'
import { LayoutDesktopNav } from './LayoutDesktopNav'
import { LayoutMobileMenu } from './LayoutMobileMenu'

export function LayoutHeader({ skipToContent, mode, activeLink }: { mode: string; skipToContent: string; activeLink?: string }) {
  const startLinkItem = getNavigationItem('Start')

  return (
    <IDSHeader1177
      skipToContentLink={<a href={skipToContent}>Till sidans huvudinnehåll</a>}
      logo={startLinkItem && getNavigationItemUrl(startLinkItem, mode)}
      mobileMenu={<LayoutMobileMenu mode={mode} activeLink={activeLink} />}
      hideRegionPicker
    >
      <LayoutDesktopNav mode={mode} activeLink={activeLink} />
    </IDSHeader1177>
  )
}
