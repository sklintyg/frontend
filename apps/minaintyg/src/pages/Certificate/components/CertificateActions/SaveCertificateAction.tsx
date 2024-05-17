import { IDSButton } from '@frontend/ids-react-ts'
import { usePrintCertificateContext } from './hooks/usePrintCertificate'

export function SaveCertificateAction() {
  const { setSaveWarningDialogOpen, showCustomizePrintDialog, customizePrintFunction } = usePrintCertificateContext()

  return (
    <IDSButton
      secondary
      sblock
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
