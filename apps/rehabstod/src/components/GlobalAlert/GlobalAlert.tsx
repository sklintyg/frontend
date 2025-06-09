import { IDSAlertGlobal, IDSIconAttention, IDSIconInformation, IDSIconWarning } from '@inera/ids-react'
import type { ReactNode } from 'react'

export enum PriorityEnum {
  'INFO',
  'OBSERVE',
  'ERROR',
}

export function GlobalAlert({ children, priority }: { children: ReactNode; priority: PriorityEnum }) {
  return (
    <div className="print:hidden">
      <IDSAlertGlobal headline="Driftmeddelande">
        {priority === PriorityEnum.INFO && <IDSIconInformation data-testid="LOW_ICON" />}
        {priority === PriorityEnum.OBSERVE && <IDSIconAttention data-testid="MEDIUM_ICON" />}
        {priority === PriorityEnum.ERROR && <IDSIconWarning data-testid="HIGH_ICON" />}
        {children}
      </IDSAlertGlobal>
    </div>
  )
}
