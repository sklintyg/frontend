import { ContactSupportMessage } from '../ContactSupportMessage'

export function InternalProblem() {
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
