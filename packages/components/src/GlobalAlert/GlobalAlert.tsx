import { IDSGlobalAlert } from '@inera/ids-react'
import type { ReactNode } from 'react'

type GlobalAlertProps = {
  readonly children: ReactNode
}

export function GlobalAlert({ children }: GlobalAlertProps) {
  return (
    <IDSGlobalAlert headline="Driftmeddelande" className="print:hidden">
      {children}
    </IDSGlobalAlert>
  )
}
