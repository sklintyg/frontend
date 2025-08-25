import { ContactSupportMessage } from '../ContactSupportMessage'

function LoginFailed() {
  return (
    <>
      <p>
        <strong>Inloggningen misslyckades</strong>
      </p>
      <p>
        Detta kan bero på att du saknar behörighet till Webcert eller att du saknar giltigt medarbetaruppdrag med ändamål "Vård och
        behandling" <ContactSupportMessage />
      </p>
    </>
  )
}

export default LoginFailed
