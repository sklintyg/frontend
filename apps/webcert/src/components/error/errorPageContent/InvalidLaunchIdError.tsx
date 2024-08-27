import { ContactSupportMessage } from '../ContactSupportMessage'

export function InvalidLaunchIdError() {
  return (
    <>
      <p>
        <strong>Intyget kan inte visas</strong>
      </p>
      <p>
        Detta intyg kan inte visas eftersom du har öppnat ett annat intyg. <ContactSupportMessage />
      </p>
    </>
  )
}
