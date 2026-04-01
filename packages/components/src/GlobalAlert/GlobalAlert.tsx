import { IDSGlobalAlert } from '@inera/ids-react'
import type { ReactNode } from 'react'
import { Icon } from '../Icon/Icon'

export enum PriorityEnum {
  'INFO',
  'OBSERVE',
  'ERROR',
}

export function GlobalAlert({ children, priority }: { children: ReactNode; priority: PriorityEnum }) {
  return (
    <IDSGlobalAlert headline="Driftmeddelande" className="print:hidden">
      {priority === PriorityEnum.INFO && <Icon icon="information" data-testid="LOW_ICON" />}
      {priority === PriorityEnum.OBSERVE && <Icon icon="attention" data-testid="MEDIUM_ICON" />}
      {priority === PriorityEnum.ERROR && <Icon icon="warning" data-testid="HIGH_ICON" />}
      {children}
    </IDSGlobalAlert>
  )
}
