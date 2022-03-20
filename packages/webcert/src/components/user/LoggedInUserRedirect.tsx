import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, useHistory } from 'react-router-dom'
import {
  isCareAdministrator as selectIsCareAdministrator,
  isDoctor as selectIsDoctor,
  selectIsLoadingUser,
} from '../../store/user/userSelectors'

export const LoggedInUserRedirect: React.FC = ({ children }) => {
  const isLoadingUser = useSelector(selectIsLoadingUser)
  const isDoctor = useSelector(selectIsDoctor)
  const isCareAdministrator = useSelector(selectIsCareAdministrator)
  const history = useHistory()

  if (isLoadingUser) {
    return null
  }

  if (history.location.pathname === '/' && isDoctor) {
    // history.push('/create')
    // return null
    return <Redirect to="/create" />
  }

  if (history.location.pathname === '/' && isCareAdministrator) {
    // history.push('/unhandled')
    // return null
    return <Redirect to="/unhandled" />
  }

  return <>{children}</>
}
