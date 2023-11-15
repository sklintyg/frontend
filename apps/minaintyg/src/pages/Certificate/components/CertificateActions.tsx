import { IDSButton, IDSButtonGroup, IDSColumn, IDSIconFilePdf, IDSRow } from '@frontend/ids-react-ts'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AvailableFunction, AvailableFunctionsTypeEnum, CertificateRecipient } from '../../../schema/certificate.schema'
import { CertificateSentDialog } from './CertificateSentDialog/CertificateSentDialog'

export function CertificateActions({
  recipient,
  availableFunctions,
  id,
}: {
  recipient?: CertificateRecipient | null
  availableFunctions: AvailableFunction[]
  id: string
}) {
  const [showCertificateSentDialog, updateShowCertificateSentDialog] = useState(false)
  const navigate = useNavigate()
  const sendFunction = availableFunctions.find(
    (availableFunction) => availableFunction.type === AvailableFunctionsTypeEnum.enum.SEND_CERTIFICATE
  )
  const printFunction = availableFunctions.find(
    (availableFunction) => availableFunction.type === AvailableFunctionsTypeEnum.enum.PRINT_CERTIFICATE
  )
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const printCertificate = (customizeId: string | undefined) => {
    if (!iframeRef || !iframeRef.current) {
      return
    }
    iframeRef.current.onload = () => {
      setTimeout(() => {
        iframeRef.current?.focus()
        iframeRef.current?.contentWindow?.print()
      }, 1)
    }
    iframeRef.current.src = `/api/certificate/${id}/pdf/${customizeId && ''}`
  }

  return (
    <IDSButtonGroup rtl>
      {sendFunction && recipient && (
        <>
          <IDSButton
            sblock
            role="button"
            onClick={() => {
              if (recipient?.sent) {
                updateShowCertificateSentDialog(true)
              } else {
                navigate('./skicka')
              }
            }}
          >
            {sendFunction.name}
          </IDSButton>
          <CertificateSentDialog recipient={recipient} open={showCertificateSentDialog} onOpenChange={updateShowCertificateSentDialog} />
        </>
      )}
      {printFunction && (
        <>
          <IDSButton secondary sblock role="button" onClick={() => printCertificate(undefined)}>
            <IDSRow className="justify-center" align="center">
              <IDSColumn cols="auto" className="ids-mr-3">
                <IDSIconFilePdf />
              </IDSColumn>
              <IDSColumn cols="auto">Skriv ut</IDSColumn>
            </IDSRow>
          </IDSButton>
          <iframe ref={iframeRef} title="title" hidden />
        </>
      )}
    </IDSButtonGroup>
  )
}
