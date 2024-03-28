import { CertificateRecipient } from '../../../../schema/certificate.schema'
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
      <div className="flex flex-col justify-end gap-5 md:flex-row">
        {(printFunction || customizePrintFunction) && !isMobileApp() && (
          <>
            <SaveCertificateAction />
            <PrintCertificateAction />
          </>
        )}
        {recipient && <SendCertificateAction recipient={recipient} id={id} />}
        <CustomizePrintDialog />
        <SaveCertificateWarningDialog />
      </div>
    </PrintCertificateContextProvider>
  )
}
