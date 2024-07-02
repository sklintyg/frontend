import { IDSHeader } from '@frontend/ids-react-ts'
import type { ReactNode } from 'react'
import { getNavigationItem, getNavigationItemUrl } from '../navigation'

export function LayoutHeader({ children, mode }: { mode: string; children?: ReactNode }) {
  const startLinkItem = getNavigationItem('Start')

  return (
    <IDSHeader
      type="1177"
      logohref={startLinkItem && getNavigationItemUrl(startLinkItem, mode)}
      hideregionpicker
      className="z-40 bg-white print:hidden"
    >
      {children}
    </IDSHeader>
  )
}
