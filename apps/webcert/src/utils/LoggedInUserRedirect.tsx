import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { START_URL_FOR_ADMINISTRATORS, START_URL_FOR_DOCTORS } from '../constants'
import {
  isCareAdministrator as selectIsCareAdministrator,
  isDoctor as selectIsDoctor,
  isNurse as selectIsNurse,
  selectIsLoadingUser,
} from '../store/user/userSelectors'
import SpinnerBackdrop from '../components/utils/SpinnerBackdrop'

export const LoggedInUserRedirect: React.FC = ({ children }) => {
  const isLoadingUser = useSelector(selectIsLoadingUser)
  const isDoctor = useSelector(selectIsDoctor)
  const isNurse = useSelector(selectIsNurse)
  const isCareAdministrator = useSelector(selectIsCareAdministrator)

  if (isLoadingUser) {
    return <SpinnerBackdrop open spinnerText="Laddar..." />
  }

  if (isDoctor || isNurse) {
    return <Redirect to={START_URL_FOR_DOCTORS} />
  }

  if (isCareAdministrator) {
    return <Redirect to={START_URL_FOR_ADMINISTRATORS} />
  }

  return <>{children}</>
}
