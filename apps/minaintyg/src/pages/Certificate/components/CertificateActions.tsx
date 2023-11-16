import { IDSButton, IDSButtonGroup } from '@frontend/ids-react-ts'
import { useState } from 'react'
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
        <IDSButton secondary sblock role="button" onClick={() => window.open(`/api/certificate/${id}/pdf`, '_blank')}>
          Skriv ut
        </IDSButton>
      )}
    </IDSButtonGroup>
  )
}
