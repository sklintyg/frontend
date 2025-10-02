import { IDSAlertGlobal } from '@inera/ids-react'
import type { ReactNode } from 'react'
import { classNames } from '../../utils/classNames'

export enum PriorityEnum {
  'INFO',
  'OBSERVE',
  'ERROR',
}

export function GlobalAlert({ children, priority }: { children: ReactNode; priority: PriorityEnum }) {
  return (
    <div className="print:hidden">
      <IDSAlertGlobal
        headline={<h2>Driftmeddelande</h2>}
        icon={
          <span
            data-testid="global-alert-icon"
            className={classNames(
              priority === PriorityEnum.INFO && 'ids-icon-information',
              priority === PriorityEnum.OBSERVE && 'ids-icon-attention',
              priority === PriorityEnum.ERROR && 'ids-icon-warning'
            )}
          />
        }
      >
        {children}
      </IDSAlertGlobal>
    </div>
  )
}
