import { ContactSupportMessage } from '../ContactSupportMessage'

export function MedarbetaruppdragSaknas() {
  return (
    <>
      <p>
        <strong>Medarbetaruppdrag saknas</strong>
      </p>
      <p>
        Det krävs minst ett giltigt medarbetaruppdrag med ändamål "Vård och behandling" för att använda Webcert. <ContactSupportMessage />
      </p>
    </>
  )
}
