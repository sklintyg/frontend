import { Link } from 'react-router-dom'
import { HOSPStatusBox } from './components/HOSPStatusBox'
import { PPForm } from './components/PPForm'
import { PPLayout } from './components/PPLayout'
import { PPRegistrationAction } from './components/PPRegistrationActions'

export function PPRegistrationStep04() {
  return (
    <PPLayout subHeader="Skapa konto: Steg 4 av 4">
      <PPForm
        actions={<PPRegistrationAction prevStep={3} continueText="Skapa konto" />}
        onSubmit={() => {
          console.log('do it!!')
        }}
      >
        <h3>Dina och verksamhetens uppgifter</h3>
        <Link to="/register/step-1">Ändra</Link>
        <hr />

        <h3>Kontaktuppgifter till verksamheten</h3>
        <Link to="/register/step-2">Ändra</Link>
        <hr />

        <h3>Socialstyrelsens uppgifter</h3>
        <p>Nedanstående uppgifter är hämtade från Socialstyrelsen och kan inte ändras.</p>
        <HOSPStatusBox />
        <Link to="/register/step-3">Ändra</Link>
        <hr />
      </PPForm>
    </PPLayout>
  )
}
