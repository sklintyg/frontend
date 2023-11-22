import { IDSButton } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AvailableFunction, AvailableFunctionsTypeEnum, CertificateRecipient } from '../../../../schema/certificate.schema'
import { CertificateSentDialog } from '../CertificateSentDialog/CertificateSentDialog'
import { PrintCertificateAction } from './PrintCertificateAction'

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

  return (
    <div className="flex flex-col justify-end gap-5 md:flex-row">
      <PrintCertificateAction id={id} availableFunctions={availableFunctions} />
      {sendFunction && recipient && (
        <>
          <IDSButton
            sblock
            role="button"
            onClick={() => {
              if (!sendFunction?.enabled) {
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
