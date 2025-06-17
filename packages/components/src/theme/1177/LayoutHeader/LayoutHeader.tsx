import { IDSHeader, IDSLink } from '@frontend/ids-react-ts'
import type { ReactNode } from 'react'
import { getNavigationItem, getNavigationItemUrl } from '../navigation'

export function LayoutHeader({ children, skipToContent, mode }: { mode: string; skipToContent?: string; children?: ReactNode }) {
  const startLinkItem = getNavigationItem('Start')

  return (
    <IDSHeader
      type="1177"
      logohref={startLinkItem && getNavigationItemUrl(startLinkItem, mode)}
      hideregionpicker
      className="z-40 bg-white print:hidden"
    >
      {skipToContent && (
        <IDSLink slot="skip-to-content" className="z-40">
          <a href={skipToContent}>Till sidans huvudinnehåll</a>
        </IDSLink>
      )}
      {children}
    </IDSHeader>
  )
}
