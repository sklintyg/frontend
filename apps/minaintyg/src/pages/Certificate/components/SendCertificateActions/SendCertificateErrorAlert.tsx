import { IDSAlert } from '@frontend/ids-react-ts'
import { CertificateRecipient } from '../../../../schema/certificate.schema'

export function SendCertificateErrorAlert({ recipient: { name } }: { recipient: CertificateRecipient }) {
  return (
    <IDSAlert headline="Intyget kunde inte skickas" type="error" className="ids-content">
      <p className="mb-4">På grund av ett tekniskt fel kunde ditt intyg inte skickas till följande mottagare:</p>
      <p className="mb-4">
        <strong>{name}</strong>
      </p>
      <p>Försök igen senare. Om problemet kvarstår, kontakta support.</p>
    </IDSAlert>
  )
}
