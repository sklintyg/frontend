import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import CommonLayout from '../../../components/commonLayout/CommonLayout'
import WebcertHeader from '../../../components/header/WebcertHeader'
import { useGetHOSPInformationQuery } from '../../../store/pp/ppApi'
import { useAppSelector } from '../../../store/store'

export function PPLayout() {
  useGetHOSPInformationQuery()
  const location = useLocation()
  const navigate = useNavigate()
  const hasSomeStepOneData = useAppSelector((state) => Object.values(state.ui.pp.step01.data).some(Boolean))
  const hasSomeStepTwoData = useAppSelector((state) => Object.values(state.ui.pp.step02.data).some(Boolean))

  const steps = ['', 'step-1', 'step-2', 'done']
  useEffect(() => {
    const path = location.pathname.split('/').at(-1)
    if (path) {
      if (steps.indexOf(path) > 1 && !hasSomeStepOneData) {
        navigate('/register/step-1')
      } else if (steps.indexOf(path) > 2 && !hasSomeStepTwoData) {
        navigate('/register/step-2')
      }
    }
  })

  return (
    <CommonLayout header={<WebcertHeader />}>
      <Outlet />
    </CommonLayout>
  )
}
