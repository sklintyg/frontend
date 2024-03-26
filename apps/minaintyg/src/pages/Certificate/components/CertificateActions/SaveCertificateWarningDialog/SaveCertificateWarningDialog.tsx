import { Dialog } from '@frontend/components'
import { ReactNode } from 'react'

export function SaveCertificateWarningDialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} headline="Spara intyg som PDF">
      <p className="mb-5">Viktigt! Ditt intyg har information om dig, som ditt namn och andra personuppgifter.</p>
      <p>
        När du sparar intyget som en PDF-fil, sparas filen på den enhet du använder. Om du använder en dator som andra också kan använda,
        till exempel på ett bibliotek, måste du själv ta bort filen från datorn innan du går därifrån.
      </p>
      {children}
    </Dialog>
  )
}
