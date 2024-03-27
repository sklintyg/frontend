import { LinkButton } from '@frontend/components'
import { IDSButton } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { SaveCertificateWarningDialog } from './SaveCertificateWarningDialog/SaveCertificateWarningDialog'
import { usePrintCertificateContext } from './hooks/usePrintCertificate'

export function SaveCertificateAction() {
  const { url, customizePrintFunction, showCustomizePrintDialog } = usePrintCertificateContext()
  const [saveWarningDialogOpen, setSaveWarningDialogOpen] = useState(false)
  const hideSaveWarningDialog = () => setSaveWarningDialogOpen(false)

  return (
    <div>
      <IDSButton secondary sblock role="button" onClick={() => setSaveWarningDialogOpen(true)}>
        Spara PDF
      </IDSButton>
      <SaveCertificateWarningDialog open={saveWarningDialogOpen} onOpenChange={setSaveWarningDialogOpen}>
        <IDSButton slot="action" secondary mblock onClick={hideSaveWarningDialog}>
          Avbryt
        </IDSButton>
        {customizePrintFunction ? (
          <IDSButton
            slot="action"
            sblock
            role="button"
            onClick={() => {
              hideSaveWarningDialog()
              showCustomizePrintDialog('save')
            }}
          >
            Fortsätt och spara
          </IDSButton>
        ) : (
          <LinkButton href={url} slot="action" type="application/pdf" download onClick={hideSaveWarningDialog}>
            Spara
          </LinkButton>
        )}
      </SaveCertificateWarningDialog>
    </div>
  )
}
