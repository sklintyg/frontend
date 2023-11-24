import { SupportLink } from '../../../components/error/SupportLink/SupportLink'
import { TechnicalIssueAlert } from '../../../components/error/TechnicalIssueAlert'
import { QueryError } from '../../../utils/isQueryError'

export function ReadCertificateError({ error }: { error: QueryError }) {
  return (
    <TechnicalIssueAlert
      error={error}
      additionalInfo={<p>Om du inte kan nå ditt intyg, kontakta din läkare för att få en kopia av intyget.</p>}
    >
      <p>
        Intyget kunde inte visas på grund av ett tekniskt fel. Försök igen senare. Om felet kvarstår kontakta <SupportLink />
        och ange nedan fel-id:
      </p>
    </TechnicalIssueAlert>
  )
}
