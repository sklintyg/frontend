import { IDSButton, IDSDialogActions } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { AvailableFunction, AvailableFunctionsTypeEnum } from '../../../../schema/certificate.schema'
import { CustomizePrintDialog } from './CustomizePrintDialog'

export function PrintCertificateAction({ id, availableFunctions }: { id: string; availableFunctions: AvailableFunction[] }) {
  const [customizePrintDialogOpen, showCustomizePrintDialog] = useState(false)
  const [customizeId, setCustomizeId] = useState('')

  const printFunction = availableFunctions.find(
    (availableFunction) => availableFunction.type === AvailableFunctionsTypeEnum.enum.PRINT_CERTIFICATE
  )

  const customizePrintFunction = availableFunctions.find(
    (availableFunction) => availableFunction.type === AvailableFunctionsTypeEnum.enum.CUSTOMIZE_PRINT_CERTIFICATE
  )

  const openFile = () => window.open(`/api/certificate/${id}/pdf${customizeId ? `?customizationId=${customizeId}` : ''}`, '_blank')

  if (!(printFunction || customizePrintFunction)) {
    return null
  }

  return (
    <div>
      <IDSButton
        secondary
        sblock
        role="button"
        onClick={() => {
          if (customizePrintFunction) {
            showCustomizePrintDialog(true)
          } else {
            openFile()
          }
        }}
      >
        Skriv ut
      </IDSButton>
      {customizePrintFunction && (
        <CustomizePrintDialog
          open={customizePrintDialogOpen}
          fn={customizePrintFunction}
          currentValue={customizeId}
          onChange={(event) => setCustomizeId(event.target.value)}
          onOpenChange={showCustomizePrintDialog}
        >
          <IDSDialogActions>
            <IDSButton mblock onClick={() => showCustomizePrintDialog(false)} role="button" secondary>
              Avbryt
            </IDSButton>
            <IDSButton
              mblock
              onClick={() => {
                openFile()
                showCustomizePrintDialog(false)
              }}
              role="button"
            >
              Skriv ut
            </IDSButton>
          </IDSDialogActions>
        </CustomizePrintDialog>
      )}
    </div>
  )
}
