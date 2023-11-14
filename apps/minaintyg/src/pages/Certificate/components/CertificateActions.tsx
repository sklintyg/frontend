import { IDSButton } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CertificateRecipient } from '../../../schema/certificate.schema'
import { CertificateSentDialog } from './CertificateSentDialog/CertificateSentDialog'
import { AvailableFunction, AvailableFunctionType } from '../../../schema/availableFunction.schema'

export function CertificateActions({
  recipient,
  availableFunctions,
}: {
  recipient?: CertificateRecipient | null
  availableFunctions: AvailableFunction[]
}) {
  const [showCertificateSentDialog, updateShowCertificateSentDialog] = useState(false)
  const navigate = useNavigate()
  const sendFunction = availableFunctions.find(
    (availableFunction) => availableFunction.type === AvailableFunctionType.enum.SEND_CERTIFICATE
  )

  return (
    <div className="flex justify-end">
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
    </div>
  )
}
