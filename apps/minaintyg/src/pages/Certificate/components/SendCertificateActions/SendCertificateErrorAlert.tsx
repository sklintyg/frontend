import { SupportLink } from '../../../../components/error/SupportLink/SupportLink'
import { TechnicalIssueAlert } from '../../../../components/error/TechnicalIssueAlert'
import { CertificateRecipient } from '../../../../schema/certificate.schema'
import { QueryError } from '../../../../utils/isQueryError'

export function SendCertificateErrorAlert({ recipient: { name }, error }: { recipient: CertificateRecipient; error: QueryError }) {
  return (
    <TechnicalIssueAlert headline="Intyget kunde inte skickas" error={error}>
      <p>På grund av ett tekniskt fel kunde ditt intyg inte skickas till följande mottagare:</p>
      <p>
        <strong>{name}</strong>
      </p>
      <p>
        Försök igen senare. Om problemet kvarstår, kontakta <SupportLink /> och ange nedan fel-id:
      </p>
    </TechnicalIssueAlert>
  )
}
