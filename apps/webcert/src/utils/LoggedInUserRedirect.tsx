import type React from 'react'
import { Redirect } from 'react-router-dom'
import SpinnerBackdrop from '../components/utils/SpinnerBackdrop'
import { START_URL, START_URL_FOR_ADMINISTRATORS } from '../constants'
import { useAppSelector } from '../store/store'
import { getUser, isCareAdministrator as selectIsCareAdministrator, selectIsLoadingUser } from '../store/user/userSelectors'

export const LoggedInUserRedirect: React.FC = ({ children: startPage }) => {
  const isLoadingUser = useAppSelector(selectIsLoadingUser)
  const isCareAdministrator = useAppSelector(selectIsCareAdministrator)
  const user = useAppSelector(getUser)

  if (isLoadingUser) {
    return <SpinnerBackdrop open spinnerText="Laddar..." />
  }

  if (!user) {
    return <>{startPage}</>
  }

  if (isCareAdministrator) {
    return <Redirect to={START_URL_FOR_ADMINISTRATORS} />
  }

  return <Redirect to={START_URL} />
}
