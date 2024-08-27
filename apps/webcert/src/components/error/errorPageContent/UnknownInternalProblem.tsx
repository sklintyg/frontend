import { ContactSupportMessage } from '../ContactSupportMessage'

export function UnknownInternalProblem() {
  return (
    <>
      <p>
        <strong>Intyget kunde inte visas</strong>
      </p>
      <p>
        Prova att ladda om sidan. <ContactSupportMessage />
      </p>
    </>
  )
}
