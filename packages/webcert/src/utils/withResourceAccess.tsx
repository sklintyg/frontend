import React from 'react'
import { Backdrop, ResourceLinkType } from '@frontend/common'
import { getUser, getUserResourceLinks, selectIsLoadingUser } from '../store/user/userSelectors'
import { useSelector } from 'react-redux'
import { Redirect, useLocation } from 'react-router-dom'

export function withResourceAccess<P>(WrappedComponent: React.FC): React.FC<P> {
  return (props: P) => {
    const isLoadingUser = useSelector(selectIsLoadingUser)
    const user = useSelector(getUser)
    const userLinks = useSelector(getUserResourceLinks)
    const location = useLocation()
    const resourceAccessMap = new Map<string, ResourceLinkType>([['/create', ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE]])
    const linkType = resourceAccessMap.get(location.pathname)

    if (!isLoadingUser && (!user || !linkType || !userLinks.some((link) => link.type === linkType))) {
      return <Redirect to="/" />
    } else {
      return (
        <Backdrop open={isLoadingUser} spinnerText="Laddar...">
          <WrappedComponent {...props} />
        </Backdrop>
      )
    }
  }
}
