import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import CommonLayout from '../../../components/commonLayout/CommonLayout'
import WebcertHeader from '../../../components/header/WebcertHeader'
import Spinner from '../../../components/utils/Spinner'
import { useGetHOSPInformationQuery } from '../../../store/pp/ppApi'
import { useAppSelector } from '../../../store/store'
import { selectIsLoadingUser } from '../../../store/user/userSelectors'
import { PPSubHeader } from './PPSubHeader'

const steps = ['', 'step-1', 'step-2', 'step-3', 'step-4', 'done']

export function PPLayout() {
  useGetHOSPInformationQuery()
  const location = useLocation()
  const navigate = useNavigate()
  const isLoadingUser = useAppSelector(selectIsLoadingUser)
  const hasSomeStepOneData = useAppSelector((state) => Object.values(state.ui.pp.step01.data).some(Boolean))
  const hasSomeStepTwoData = useAppSelector((state) => Object.values(state.ui.pp.step02.data).some(Boolean))
  const path = location.pathname.split('/').at(-1)

  useEffect(() => {
    if (path) {
      if (steps.indexOf(path) > 1 && !hasSomeStepOneData) {
        navigate('/register/step-1')
      } else if (steps.indexOf(path) > 2 && !hasSomeStepTwoData) {
        navigate('/register/step-2')
      }
    }
  }, [hasSomeStepOneData, hasSomeStepTwoData, location.pathname, navigate, path])

  let subHeader: ReactNode = null
  if (path) {
    if (steps.indexOf(path) > 0 && steps.indexOf(path) < 4) {
      subHeader = `Skapa konto: Steg ${steps.indexOf(path)} av 4`
    } else if (steps.indexOf(path) === 5) {
      subHeader = 'Skapa konto'
    }
  }

  return (
    <CommonLayout header={<WebcertHeader />} subHeader={subHeader ? <PPSubHeader>{subHeader}</PPSubHeader> : null}>
      {isLoadingUser ? <Spinner /> : <Outlet />}
    </CommonLayout>
  )
}
