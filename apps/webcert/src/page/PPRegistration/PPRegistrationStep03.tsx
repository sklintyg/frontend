import { useNavigate } from 'react-router-dom'
import { HOSPStatusBox } from './components/HOSPStatusBox'
import { PPForm } from './components/PPForm'
import { PPPage } from './components/PPPage'
import { PPRegistrationAction } from './components/PPRegistrationActions'
import { PPStep03Fields } from './components/PPStep03/PPStep03Fields'
import { PPStep03Intro } from './components/PPStep03/PPStep03Intro'

export function PPRegistrationStep03() {
  const navigate = useNavigate()

  return (
    <PPPage>
      <PPStep03Intro />
      <HOSPStatusBox variant />
      <PPForm
        onSubmit={(event) => {
          event.preventDefault()
          navigate('/register/preview')
        }}
        actions={<PPRegistrationAction prevStep={2} continueText="Granska uppgifter" />}
      >
        <PPStep03Fields />
      </PPForm>
    </PPPage>
  )
}
