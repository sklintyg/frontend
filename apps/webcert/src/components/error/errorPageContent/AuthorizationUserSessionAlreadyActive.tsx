import { ContactSupportMessage } from '../ContactSupportMessage'

export function AuthorizationUserSessionAlreadyActive() {
  return (
    <>
      <p>
        <strong>Intyget kunde inte visas</strong>
      </p>
      <p>
        Ett problem med sessionen för Webcert har uppstått. Stäng de fönster eller flikar som är öppnade sedan tidigare och försök igen.{' '}
        <ContactSupportMessage />
      </p>
    </>
  )
}
