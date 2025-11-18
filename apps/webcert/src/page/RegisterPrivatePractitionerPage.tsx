import { Button } from '@frontend/components'

export function RegisterPrivatePractitionerPage() {
  return (
    <div>
      <h1 className="iu-mb-200">Skapa konto i Webcert</h1>
      <p className="iu-mb-600">
        Du har genomfört en beställning av abonnemang för Webcert i Ineras kundportal.
        Du som har eller är på väg att få en läkarlegitimation kan nu skapa ett konto i
        Webcert.

        Intyg som utfärdas med BankID är enbart den enskilde läkarens intyg och kan inte
        kopplas samman, överlåtas eller delas med någon organisation.
      </p>
      <h2 className="iu-mb-200">Så fungerar det</h2>
      <div className="iu-mb-100">
        <h3 className="iu-mb-100">Steg 1 - lämna uppgifter</h3>
        <p className="iu-mb-600">
          Du lämnar uppgifter om dig själv och din verksamhet. Uppgifterna
          behövs för att du ska kunna använda alla funktioner i Webcert.
        </p>
      </div>
      <div className="iu-mb-100">
        <h3 className="iu-mb-100">Steg 2 - uppgifter verifieras</h3>
        <p className="iu-mb-600">
          Din yrkeslegitimation verifieras automatiskt mot Socialstyrelsens
          register över legitimerad hälso- och sjukvårdspersonal (HOSP).
        </p>
      </div>
      <div className="iu-mb-100">
        <h3 className="iu-mb-100">Steg 3 - börja använda Webcert</h3>
        <p className="iu-mb-600">
          Efter godkänd verifiering mot Socialstyrelsens register över legitimerad
          hälso- och sjukvårdspersonal (HOSP) kan du börja använda Webcert.
        </p>
      </div>
      <>
        <Button>Avbryt och logga ut</Button>
        <Button>Skapa konto</Button>
      </>
    </div>
  );
}
