import { ContactSupportMessage } from '../ContactSupportMessage'

export function GetCertificateProblem() {
  return (
    <>
      <p>
        <strong>Intyget kunde inte visas</strong>
      </p>
      <p>
        <ContactSupportMessage />
      </p>
    </>
  )
}
