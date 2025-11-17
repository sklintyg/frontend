import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import SpinnerBackdrop from '../components/utils/SpinnerBackdrop'
import { START_URL, START_URL_FOR_ADMINISTRATORS, REGISTER_PRIVAT_PRACTITIONER_URL } from '../constants'
import { useAppSelector } from '../store/store'
import {
  getUser,
  isCareAdministrator as selectIsCareAdministrator,
  selectIsLoadingUser,
  isUnauthorizedPrivatePractitioner as selectIsUnauthorizedPrivatePractitioner,
} from '../store/user/userSelectors'

export const LoggedInUserRedirect = ({ children }: { children: ReactNode }) => {
  const isLoadingUser = useAppSelector(selectIsLoadingUser)
  const isCareAdministrator = useAppSelector(selectIsCareAdministrator)
  const isUnauthorizedPrivatePractitioner = useAppSelector(selectIsUnauthorizedPrivatePractitioner)
  const user = useAppSelector(getUser)

  if (isLoadingUser) {
    return <SpinnerBackdrop open spinnerText="Laddar..." />
  }

  if (!user) {
    return <>{children}</>
  }

  if (isUnauthorizedPrivatePractitioner) {
    return <Navigate to={REGISTER_PRIVAT_PRACTITIONER_URL} />
  }

  if (isCareAdministrator) {
    return <Navigate to={START_URL_FOR_ADMINISTRATORS} />
  }

  return <Navigate to={START_URL} />
}
