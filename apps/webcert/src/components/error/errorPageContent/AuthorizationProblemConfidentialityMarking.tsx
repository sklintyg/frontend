import { ContactSupportMessage } from '../ContactSupportMessage'

export function AuthorizationProblemConfidentialityMarking() {
  return (
    <>
      <p>
        <strong>Behörighet saknas</strong>
      </p>
      <p>
        För att hantera intyg för patienter med skyddade personuppgifter krävs att du har befattningen läkare eller tandläkare. Vissa
        intygstyper får inte hanteras alls för patienter med skyddade personuppgifter, även om du har befattningen som krävs.{' '}
        <ContactSupportMessage />
      </p>
    </>
  )
}
