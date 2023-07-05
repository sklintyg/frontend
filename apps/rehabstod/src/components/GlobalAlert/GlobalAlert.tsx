import { ReactNode } from 'react'
import { IDSAlertGlobal, IDSIconAttention } from '@frontend/ids-react-ts'

export function GlobalAlert({ children }: { children: ReactNode }) {
  return (
    <IDSAlertGlobal headline="Driftmeddelande">
      <IDSIconAttention title="informationsikon" />
      {children}
    </IDSAlertGlobal>
  )
}
