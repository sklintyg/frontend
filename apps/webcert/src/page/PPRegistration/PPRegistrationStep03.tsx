import { useNavigate } from 'react-router-dom'
import TextInput from '../../components/Inputs/TextInput'
import { useGetHOSPInformationQuery } from '../../store/pp/ppApi'
import { HOSPStatusBox } from './components/HOSPStatusBox'
import { PPForm } from './components/PPForm'
import { PPPage } from './components/PPPage'
import { PPRegistrationAction } from './components/PPRegistrationActions'

const NO_INFORMATION_FETCHED = 'Inga uppgifter hämtade'

export function PPRegistrationStep03() {
  const navigate = useNavigate()
  const { data } = useGetHOSPInformationQuery()

  return (
    <PPPage>
      <div className="flex flex-col">
        <h2 className="mb-5 text-[#5f5f5f] text-[22px]">Socialstyrelsens uppgifter</h2>
        <p className="max-w-xl mb-4">Nedanstående uppgifter är hämtade från Socialstyrelsen och kan inte ändras.</p>
      </div>
      <HOSPStatusBox />
      <PPForm
        onSubmit={(event) => {
          event.preventDefault()
          navigate('/register/granska')
        }}
        actions={<PPRegistrationAction prevStep={2} continueText="Granska uppgifter" />}
      >
        <div>
          <TextInput
            label="Legitimerad yrkesgrupp"
            style={{ fontStyle: 'italic' }}
            value={data?.licensedHealthcareProfessions.map(({ description }) => description).join(', ') ?? NO_INFORMATION_FETCHED}
            disabled
          />
        </div>

        <div>
          <TextInput
            label="Specialitet"
            style={{ fontStyle: 'italic' }}
            value={data?.specialities.map(({ description }) => description).join(', ') ?? NO_INFORMATION_FETCHED}
            disabled
          />
        </div>

        <div>
          <TextInput
            label="Förskrivarkod"
            style={{ fontStyle: 'italic' }}
            value={data?.personalPrescriptionCode ?? NO_INFORMATION_FETCHED}
            disabled
          />
        </div>
      </PPForm>
    </PPPage>
  )
}
