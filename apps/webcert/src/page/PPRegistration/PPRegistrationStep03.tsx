import { useNavigate } from 'react-router-dom'
import TextInput from '../../components/Inputs/TextInput'
import store, { useAppSelector } from '../../store/store'
import { PPForm } from './components/PPForm'
import { PPLayout } from './components/PPLayout'
import { PPRegistrationAction } from './components/PPRegistrationActions'
import { StatusBox } from './components/StatusBox'

const NO_INFORMATION_FETCHED = 'Inga uppgifter hämtade'

export function PPRegistrationStep03() {
  const navigate = useNavigate()
  const { workgroup, speciality, prescriberCode } = useAppSelector((state) => state.ui.pp.step03.data)

  return (
    <PPLayout subHeader="Skapa konto: Steg 3 av 4">
      <div className="mb-5">
        <h2>Socialstyrelsens uppgifter</h2>
        <p>Nedanstående uppgifter är hämtade från Socialstyrelsen och kan inte ändras.</p>
      </div>
      <StatusBox>
        Inga uppgifter har hämtats från Socialstyrelsens register för Hälso- och sjukvårdspersonal (HOSP), men du kan fortsätta skapa ditt
        konto.
      </StatusBox>
      <PPForm
        onSubmit={(event) => {
          event.preventDefault()
          if (!store.getState().ui.pp.step03.errors) {
            navigate('/register/step-3')
          }
        }}
        actions={<PPRegistrationAction prevStep={2} continueText="Granska uppgifter" />}
      >
        <div>
          <TextInput label="Legitimerad yrkesgrupp" value={workgroup ?? NO_INFORMATION_FETCHED} disabled />
        </div>

        <div>
          <TextInput label="Specialitet" value={speciality ?? NO_INFORMATION_FETCHED} disabled />
        </div>

        <div>
          <TextInput label="Förskrivarkod" value={prescriberCode ?? NO_INFORMATION_FETCHED} disabled />
        </div>
      </PPForm>
    </PPLayout>
  )
}
