import { format } from 'date-fns'
import { createContext, useContext, useState } from 'react'
import { AvailableFunctionsTypeEnum, InformationTypeEnum } from '../../../../../schema/certificate.schema'
import { useAvailableFunction } from '../../../../../store/hooks'

type CustomizePrintType = 'print' | 'save' | null

export function usePrintCertificate(id: string) {
  const [customizeId, setCustomizeId] = useState('')
  const [customizePrintType, setCustomizePrintType] = useState<CustomizePrintType>(null)
  const [customizePrintDialogOpen, setShowCustomizePrintDialog] = useState(false)
  const printFunction = useAvailableFunction(id, AvailableFunctionsTypeEnum.enum.PRINT_CERTIFICATE)
  const customizePrintFunction = useAvailableFunction(id, AvailableFunctionsTypeEnum.enum.CUSTOMIZE_PRINT_CERTIFICATE)

  const activePrintFunction = printFunction ?? customizePrintFunction

  const fileName = activePrintFunction?.information.find((info) => info.type === InformationTypeEnum.enum.FILENAME)
  const url = `/api/certificate/${id}/pdf/${fileName?.text}_${format(Date.now(), 'yy-MM-dd_HHmm')}.pdf${
    customizeId ? `?customizationId=${customizeId}` : ''
  }`

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
  }
}

export const PrintCertificateContext = createContext<ReturnType<typeof usePrintCertificate> | null>(null)
export const PrintCertificateContextProvider = PrintCertificateContext.Provider

export function usePrintCertificateContext() {
  const state = useContext(PrintCertificateContext)

  if (state === null) {
    throw Error('Should be used inside PrintCertificateContextProvider')
  }

  return state
}
