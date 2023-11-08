import { IDSAlert } from '@frontend/ids-react-ts'
import { ReactNode } from 'react'

export function TechnicalIssueAlert({ children }: { children: ReactNode }) {
  return (
    <IDSAlert headline="Tekniskt fel" type="error">
      {children}
      <p>Om du inte kan nå ditt intyg, kontakta din läkare för att få en kopia av intyget.</p>
    </IDSAlert>
  )
}
