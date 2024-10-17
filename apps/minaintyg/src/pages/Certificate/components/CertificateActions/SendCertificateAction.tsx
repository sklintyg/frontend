import { IDSButton } from 'ids-react-ts'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CertificateRecipient } from '../../../../schema/certificate.schema'
import { AvailableFunctionsTypeEnum } from '../../../../schema/certificate.schema'
import { useAvailableFunction } from '../../../../store/hooks'
import { CertificateSentDialog } from './CertificateSentDialog/CertificateSentDialog'

export function SendCertificateAction({ recipient, id }: { recipient: CertificateRecipient; id: string }) {
  const [showCertificateSentDialog, updateShowCertificateSentDialog] = useState(false)
  const navigate = useNavigate()
  const sendFunction = useAvailableFunction(id, AvailableFunctionsTypeEnum.enum.SEND_CERTIFICATE)

  if (!sendFunction) {
    return null
  }

  return (
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
  )
}
