import { IDSAlert } from '@inera/ids-react'
import { useFormat } from '../../../../hooks/useFormat'
import type { CertificateRecipient } from '../../../../schema/certificate.schema'

export function SendCertificateSuccessAlert({ recipient }: { recipient: CertificateRecipient }) {
  const { datetime } = useFormat()

  if (!recipient.sent) {
    return null
  }

  return (
    <IDSAlert headline="Intyg skickat" type="success" className="ids-content">
      <p className="mb-4">Ditt intyg har skickats till följande mottagare:</p>
      <p>
        <strong>
          {datetime(recipient.sent)} {recipient.name}
        </strong>
      </p>
    </IDSAlert>
  )
}
