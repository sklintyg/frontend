import { TechnicalIssueAlert } from '../../../../components/error/TechnicalIssueAlert'
import { CertificateRecipient } from '../../../../schema/certificate.schema'
import { QueryError } from '../../../../store/errorMiddleware'

export function SendCertificateErrorAlert({ recipient: { name }, error }: { recipient: CertificateRecipient; error: QueryError }) {
  return (
    <TechnicalIssueAlert headline="Intyget kunde inte skickas" error={error}>
      <p>På grund av ett tekniskt fel kunde ditt intyg inte skickas till följande mottagare:</p>
      <p>
        <strong>{name}</strong>
      </p>
      <p>Försök igen senare. Om problemet kvarstår, kontakta support.</p>
    </TechnicalIssueAlert>
  )
}
