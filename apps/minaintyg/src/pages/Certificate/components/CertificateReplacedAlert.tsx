import { IDSAlert } from '@inera/ids-react'

export function CertificateReplacedAlert() {
  return (
    <IDSAlert headline="Detta intyg har ersatts" type="attention" className="mb-2">
      Läkaren kan ersätta ett intyg om till exempel intyget innehåller fel information eller om ny information tillkommit.
    </IDSAlert>
  )
}
