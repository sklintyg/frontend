import { useNavigate } from 'react-router-dom'
import Spinner from '../../components/utils/Spinner'
import { useGetPPConfigQuery } from '../../store/pp/ppApi'
import { validateData } from '../../store/pp/ppStep01ReducerSlice'
import store, { useAppDispatch } from '../../store/store'
import { PPForm } from './components/PPForm'
import { PPPage } from './components/PPPage'
import { PPRegistrationAction } from './components/PPRegistrationActions'
import { PPStep01Fields } from './components/PPStep01/PPStep01Fields'
import { PPStep01Intro } from './components/PPStep01/PPStep01Intro'

export function PPRegistrationStep01() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading } = useGetPPConfigQuery()

  if (isLoading) {
    return <Spinner />
  }

  return (
    <PPPage>
      <PPStep01Intro />
      <PPForm
        onSubmit={(event) => {
          event.preventDefault()
          dispatch(validateData())
          if (!store.getState().ui.pp.step01.errors) {
            navigate('/register/step-2')
          }
        }}
        actions={<PPRegistrationAction />}
      >
        <PPStep01Fields />
      </PPForm>
    </PPPage>
  )
}
