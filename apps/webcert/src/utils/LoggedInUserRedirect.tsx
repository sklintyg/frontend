import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { START_URL, START_URL_FOR_ADMINISTRATORS } from '../constants'
import { getUser, isCareAdministrator as selectIsCareAdministrator, selectIsLoadingUser } from '../store/user/userSelectors'
import SpinnerBackdrop from '../components/utils/SpinnerBackdrop'

export const LoggedInUserRedirect: React.FC = ({ children: startPage }) => {
  const isLoadingUser = useSelector(selectIsLoadingUser)
  const isCareAdministrator = useSelector(selectIsCareAdministrator)
  const user = useSelector(getUser)

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
