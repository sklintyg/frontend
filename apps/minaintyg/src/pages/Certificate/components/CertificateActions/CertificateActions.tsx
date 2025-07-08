import { IDSButtonGroup } from '@inera/ids-react'
import type { CertificateRecipient } from '../../../../schema/certificate.schema'
import { isMobileApp } from '../../utils/isMobileApp'
import { CustomizePrintDialog } from './CustomizePrintDialog/CustomizePrintDialog'
import { PrintCertificateAction } from './PrintCertificateAction'
import { SaveCertificateAction } from './SaveCertificateAction'
import { SaveCertificateWarningDialog } from './SaveCertificateWarningDialog/SaveCertificateWarningDialog'
import { SendCertificateAction } from './SendCertificateAction'
import { PrintCertificateContextProvider, usePrintCertificate } from './hooks/usePrintCertificate'

export function CertificateActions({ recipient, id }: { recipient?: CertificateRecipient | null; id: string }) {
  const state = usePrintCertificate(id)
  const { printFunction, customizePrintFunction } = state

  return (
    <PrintCertificateContextProvider value={state}>
      <IDSButtonGroup justify="end">
        {(printFunction || customizePrintFunction) && !isMobileApp() && (
          <>
            <SaveCertificateAction />
            <PrintCertificateAction />
          </>
        )}
        {recipient && <SendCertificateAction recipient={recipient} id={id} />}
      </IDSButtonGroup>
      <CustomizePrintDialog />
      <SaveCertificateWarningDialog />
    </PrintCertificateContextProvider>
  )
}
