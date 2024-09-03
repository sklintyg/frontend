import WCDynamicLink from '../../../utils/WCDynamicLink'

export function AuthorizationProblemSubscription() {
  return (
    <>
      <p>
        <strong>Abonnemang saknas för Webcert</strong>
      </p>
      <p>För att kunna skapa konto behöver du först teckna kundavtal med Inera och beställa abonnemang för Webcert.</p>
      <p>
        Läs mer om Webcert och hur du beställer abonnemang <WCDynamicLink linkKey={'ineraIntygstjansterWebcert'} />.
      </p>
      <p>När du beställt abonnemang återvänder du till den här sidan för att skapa ditt konto i Webcert.</p>
    </>
  )
}
