import { IDSAlert } from '@frontend/ids-react-ts'

export function CertificateReplacedAlert() {
  return (
    <IDSAlert headline="Detta intyg har ersatts" type="attention">
      Läkaren kan ersätta ett intyg om till exempel intyget innehåller fel information eller om ny information tillkommit.
    </IDSAlert>
  )
}
