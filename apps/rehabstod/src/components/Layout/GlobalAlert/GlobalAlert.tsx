import { IDSAlertGlobal, IDSIconAttention, IDSIconInformation, IDSIconWarning } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'
import { BannerPriority } from '../../../schemas'

export function GlobalAlert({ children, priority }: { children: ReactNode; priority: BannerPriority }) {
  return (
    <IDSAlertGlobal headline="Driftmeddelande" className="print:hidden">
      {priority === BannerPriority.LOW && <IDSIconInformation data-testid="LOW_ICON" />}
      {priority === BannerPriority.MEDIUM && <IDSIconAttention data-testid="MEDIUM_ICON" />}
      {priority === BannerPriority.HIGH && <IDSIconWarning data-testid="HIGH_ICON" />}
      {children}
    </IDSAlertGlobal>
  )
}