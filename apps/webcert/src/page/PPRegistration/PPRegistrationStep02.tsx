import { isEqual } from 'lodash-es'
import { useNavigate } from 'react-router-dom'
import { api } from '../../store/api'
import { validateData } from '../../store/pp/ppStep02ReducerSlice'
import store, { useAppDispatch, useAppSelector } from '../../store/store'
import { PPForm } from './components/PPForm'
import { PPPage } from './components/PPPage'
import { PPRegistrationAction } from './components/PPRegistrationActions'
import { PPStep02Fields } from './components/PPStep02/PPStep02Fields'
import { PPStep02Intro } from './components/PPStep02/PPStep02Intro'
import { StatusBox } from './components/StatusBox'

export function PPRegistrationStep02() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { zipCode } = useAppSelector((state) => state.ui.pp.step02.data, isEqual)
  const { isError: isZipCodeError } = api.endpoints.getZipCodeInfo.useQueryState(zipCode)

  return (
    <PPPage>
      <PPStep02Intro />
      <PPForm
        onSubmit={(event) => {
          event.preventDefault()
          dispatch(validateData())
          if (!store.getState().ui.pp.step02.errors) {
            navigate('/register/steg-3')
          }
        }}
        actions={
          <>
            {isZipCodeError && (
              <StatusBox type="ERROR">Ett tekniskt fel har uppstått. Adressuppgifter kan inte hämtas. Försök igen senare.</StatusBox>
            )}
            <PPRegistrationAction prevStep={1} />
          </>
        }
      >
        <PPStep02Fields />
      </PPForm>
    </PPPage>
  )
}
