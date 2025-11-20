import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import SpinnerBackdrop from '../components/utils/SpinnerBackdrop'
import { REGISTER_PRIVATE_PRACTITIONER_URL, START_URL, START_URL_FOR_ADMINISTRATORS } from '../constants'
import { useAppSelector } from '../store/store'
import {
  getUser,
  isCareAdministrator as selectIsCareAdministrator,
  isUnauthorizedPrivatePractitioner as selectIsUnauthorizedPrivatePractitioner,
  selectIsLoadingUser,
} from '../store/user/userSelectors'

export const LoggedInUserRedirect = ({ children }: { children: ReactNode }) => {
  const isLoadingUser = useAppSelector(selectIsLoadingUser)
  const isCareAdministrator = useAppSelector(selectIsCareAdministrator)
  const user = useAppSelector(getUser)
  const isUnauthorizedPrivatePractitioner = useAppSelector(selectIsUnauthorizedPrivatePractitioner)

  if (isLoadingUser) {
    return <SpinnerBackdrop open spinnerText="Laddar..." />
  }

  if (!user) {
    return <>{children}</>
  }

  if (isUnauthorizedPrivatePractitioner) {
    return <Navigate to={REGISTER_PRIVATE_PRACTITIONER_URL} />
  }

  if (isCareAdministrator) {
    return <Navigate to={START_URL_FOR_ADMINISTRATORS} />
  }

  return <Navigate to={START_URL} />
}
