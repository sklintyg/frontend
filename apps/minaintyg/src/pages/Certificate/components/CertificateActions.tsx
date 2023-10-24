import { IDSButton } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CertificateRecipient } from '../../../schema/certificate.schema'
import { CertificateSentDialog } from './CertificateSentDialog/CertificateSentDialog'

export function CertificateActions({ recipient }: { recipient?: CertificateRecipient | null }) {
  const [showCertificateSentDialog, updateShowCertificateSentDialog] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="flex justify-end">
      {recipient && (
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
            Skicka intyg
          </IDSButton>
          <CertificateSentDialog recipient={recipient} open={showCertificateSentDialog} onOpenChange={updateShowCertificateSentDialog} />
        </>
      )}
    </div>
  )
}
