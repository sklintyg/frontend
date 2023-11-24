import { SupportLink } from '../../../components/error/SupportLink/SupportLink'
import { TechnicalIssueAlert } from '../../../components/error/TechnicalIssueAlert'
import { QueryError } from '../../../utils/isQueryError'

export function ReadCertificateError({ id, error }: { id?: string; error: QueryError }) {
  return (
    <TechnicalIssueAlert error={error}>
      <p>
        Intyget kunde inte visas på grund av ett tekniskt fel. Försök igen senare. Om felet kvarstår kontakta <SupportLink /> och ange
        intygs-id: {id}.
      </p>
      <p>Om du inte kan nå ditt intyg, kontakta din läkare för att få en kopia av intyget.</p>
    </TechnicalIssueAlert>
  )
}
