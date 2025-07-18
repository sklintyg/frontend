import { IDSButton } from '@inera/ids-react'
import { usePrintCertificateContext } from './hooks/usePrintCertificate'

export function SaveCertificateAction() {
  const { setSaveWarningDialogOpen, showCustomizePrintDialog, customizePrintFunction } = usePrintCertificateContext()

  return (
    <IDSButton
      secondary
      sBlock
      role="button"
      onClick={() => {
        if (customizePrintFunction) {
          showCustomizePrintDialog('save')
        } else {
          setSaveWarningDialogOpen(true)
        }
      }}
    >
      Spara PDF
    </IDSButton>
  )
}
