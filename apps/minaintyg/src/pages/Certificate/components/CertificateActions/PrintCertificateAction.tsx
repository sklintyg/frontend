import { IDSButton } from '@frontend/ids-react-ts'
import { format } from 'date-fns'
import { useState } from 'react'
import { CustomizePrintDialog } from './CustomizePrintDialog'
import { AvailableFunction, AvailableFunctionsTypeEnum, InformationTypeEnum } from '../../../../schema/certificate.schema'

export function PrintCertificateAction({ id, availableFunctions }: { id: string; availableFunctions: AvailableFunction[] }) {
  const [customizePrintDialogOpen, showCustomizePrintDialog] = useState(false)
  const [customizeId, setCustomizeId] = useState('')

  const printFunction = availableFunctions.find(
    (availableFunction) => availableFunction.type === AvailableFunctionsTypeEnum.enum.PRINT_CERTIFICATE
  )

  const customizePrintFunction = availableFunctions.find(
    (availableFunction) => availableFunction.type === AvailableFunctionsTypeEnum.enum.CUSTOMIZE_PRINT_CERTIFICATE
  )

  const activePrintFunction = printFunction ?? customizePrintFunction

  const fileName = activePrintFunction?.information.find((info) => info.type === InformationTypeEnum.enum.FILENAME)

  const openFile = () =>
    window.open(
      `/api/certificate/${id}/pdf/${fileName?.text}_${format(Date.now(), 'yy-MM-dd_HHmm')}${
        customizeId ? `?customizationId=${customizeId}` : ''
      }`,
      '_blank'
    )

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
          {customizePrintDialogOpen && (
            <>
              <IDSButton slot="action" mblock onClick={() => showCustomizePrintDialog(false)} role="button" secondary>
                Avbryt
              </IDSButton>
              <IDSButton
                slot="action"
                mblock
                onClick={() => {
                  openFile()
                  showCustomizePrintDialog(false)
                }}
                role="button"
              >
                Skriv ut
              </IDSButton>
            </>
          )}
        </CustomizePrintDialog>
      )}
    </div>
  )
}
