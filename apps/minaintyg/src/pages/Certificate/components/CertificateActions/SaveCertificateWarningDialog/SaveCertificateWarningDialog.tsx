import { Dialog, LinkButton } from '@frontend/components'
import { IDSButton } from '@inera/ids-react'
import { usePrintCertificateContext } from '../hooks/usePrintCertificate'

export function SaveCertificateWarningDialog() {
  const { url, saveWarningDialogOpen, setSaveWarningDialogOpen } = usePrintCertificateContext()
  return (
    <Dialog open={saveWarningDialogOpen} onOpenChange={setSaveWarningDialogOpen} headline="Spara intyg som PDF">
      <div className="max-w-3xl">
        <p className="mb-5">Viktigt! Ditt intyg har information om dig, som ditt namn och andra personuppgifter.</p>
        <p>
          När du sparar intyget som en PDF-fil, sparas filen på den enhet du använder. Om du använder en dator som andra också kan använda,
          till exempel på ett bibliotek, måste du själv ta bort filen från datorn innan du går därifrån.
        </p>
      </div>
      <IDSButton slot="action" mblock secondary onClick={() => setSaveWarningDialogOpen(false)}>
        Avbryt
      </IDSButton>
      <LinkButton href={url} slot="action" mblock type="application/pdf" download onClick={() => setSaveWarningDialogOpen(false)}>
        Spara
      </LinkButton>
    </Dialog>
  )
}
