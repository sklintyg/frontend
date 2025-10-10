import { format } from 'date-fns'
import { createContext, useContext, useState } from 'react'
import { AvailableFunctionsTypeEnum, InformationTypeEnum } from '../../../../../schema/certificate.schema'
import { useAvailableFunction } from '../../../../../store/hooks'

type CustomizePrintType = 'print' | 'save' | null

export function usePrintCertificate(certificateId: string) {
  const [customizeId, setCustomizeId] = useState('')
  const [customizePrintType, setCustomizePrintType] = useState<CustomizePrintType>(null)
  const [customizePrintDialogOpen, setShowCustomizePrintDialog] = useState(false)
  const [saveWarningDialogOpen, setSaveWarningDialogOpen] = useState(false)
  const printFunction = useAvailableFunction(certificateId, AvailableFunctionsTypeEnum.enum.PRINT_CERTIFICATE)
  const customizePrintFunction = useAvailableFunction(certificateId, AvailableFunctionsTypeEnum.enum.CUSTOMIZE_PRINT_CERTIFICATE)

  const activePrintFunction = printFunction ?? customizePrintFunction

  const fileName = activePrintFunction?.information.find((info) => info.type === InformationTypeEnum.enum.FILENAME)
  const url = `/api/certificate/${certificateId}/pdf/${fileName?.text}_${format(Date.now(), 'yy-MM-dd_HHmm')}.pdf${
    customizeId ? `?customizationId=${customizeId}` : ''
  }`

  const hideDiagnoseSelected = customizePrintFunction?.information.some(({ id, text }) => id === customizeId && text === 'Dölj Diagnos')

  function showCustomizePrintDialog(type: CustomizePrintType) {
    setShowCustomizePrintDialog(true)
    setCustomizePrintType(type)
  }

  function hideCustomizePrintDialog() {
    setShowCustomizePrintDialog(false)
  }

  return {
    url,
    customizePrintFunction,
    printFunction,
    customizeId,
    setCustomizeId,
    customizePrintDialogOpen,
    showCustomizePrintDialog,
    hideCustomizePrintDialog,
    setShowCustomizePrintDialog,
    customizePrintType,
    saveWarningDialogOpen,
    setSaveWarningDialogOpen,
    hideDiagnoseSelected,
  }
}

const PrintCertificateContext = createContext<ReturnType<typeof usePrintCertificate> | null>(null)
export const PrintCertificateContextProvider = PrintCertificateContext.Provider

export function usePrintCertificateContext() {
  const state = useContext(PrintCertificateContext)

  if (state === null) {
    throw Error('Should be used inside PrintCertificateContextProvider')
  }

  return state
}
