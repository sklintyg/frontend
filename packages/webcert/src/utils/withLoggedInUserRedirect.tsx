import { Backdrop } from '@frontend/common'
import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { START_URL_FOR_ADMINISTRATORS, START_URL_FOR_DOCTORS } from '../constants'
import {
  isCareAdministrator as selectIsCareAdministrator,
  isDoctor as selectIsDoctor,
  selectIsLoadingUser,
} from '../store/user/userSelectors'

export function withLoggedInUserRedirect<P>(WrappedComponent: React.FC): React.FC<P> {
  const WithRedirect: React.FC<P> = (props: P) => {
    const isLoadingUser = useSelector(selectIsLoadingUser)
    const isDoctor = useSelector(selectIsDoctor)
    const isCareAdministrator = useSelector(selectIsCareAdministrator)

    if (isLoadingUser) {
      return <Backdrop open spinnerText="Laddar..." />
    }

    if (isDoctor) {
      return <Redirect to={START_URL_FOR_DOCTORS} />
    }

    if (isCareAdministrator) {
      return <Redirect to={START_URL_FOR_ADMINISTRATORS} />
    }

    return <WrappedComponent {...props} />
  }

  return WithRedirect
}
