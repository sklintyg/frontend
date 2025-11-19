import { useNavigate } from 'react-router-dom'
import TextInput from '../../components/Inputs/TextInput'
import { useGetHOSPInformationQuery } from '../../store/pp/ppApi'
import { HOSPStatusBox } from './components/HOSPStatusBox'
import { PPForm } from './components/PPForm'
import { PPLayout } from './components/PPLayout'
import { PPRegistrationAction } from './components/PPRegistrationActions'

const NO_INFORMATION_FETCHED = 'Inga uppgifter hämtade'

export function PPRegistrationStep03() {
  const navigate = useNavigate()
  const { data } = useGetHOSPInformationQuery()

  return (
    <PPLayout subHeader="Skapa konto: Steg 3 av 4">
      <div className="mb-5">
        <h2>Socialstyrelsens uppgifter</h2>
        <p>Nedanstående uppgifter är hämtade från Socialstyrelsen och kan inte ändras.</p>
      </div>
      <HOSPStatusBox />
      <PPForm
        onSubmit={(event) => {
          event.preventDefault()
          navigate('/register/step-4')
        }}
        actions={<PPRegistrationAction prevStep={2} continueText="Granska uppgifter" />}
      >
        <div>
          <TextInput
            label="Legitimerad yrkesgrupp"
            value={data?.licensedHealthcareProfessions[0].description ?? NO_INFORMATION_FETCHED}
            disabled
          />
        </div>

        <div>
          <TextInput label="Specialitet" value={data?.specialities[0].description ?? NO_INFORMATION_FETCHED} disabled />
        </div>

        <div>
          <TextInput label="Förskrivarkod" value={data?.personalPrescriptionCode ?? NO_INFORMATION_FETCHED} disabled />
        </div>
      </PPForm>
    </PPLayout>
  )
}
