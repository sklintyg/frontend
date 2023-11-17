import { IDSAlert, IDSButton } from '@frontend/ids-react-ts'
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
  const infoFunction = availableFunctions.find((availableFunction) => availableFunction.type === AvailableFunctionsTypeEnum.enum.INFO)

  return (
    <>
      {infoFunction && (
        <div className="mb-5">
          <IDSAlert key={infoFunction.name} type="info" headline={infoFunction.title || ''}>
            {infoFunction.body}
          </IDSAlert>
        </div>
      )}
      <div className="flex flex-col justify-end gap-5 md:flex-row">
        <PrintCertificateAction id={id} availableFunctions={availableFunctions} />
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
    </>
  )
}
