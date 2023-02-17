import { ResourceLinkType, SpinnerBackdrop } from '@frontend/common'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'
import { throwError } from '../store/error/errorActions'
import { ErrorCode, ErrorType } from '../store/error/errorReducer'
import { getUser, getUserResourceLinks, selectIsLoadingUser } from '../store/user/userSelectors'

export const ResourceAccess: React.FC = ({ children }) => {
  const isLoadingUser = useSelector(selectIsLoadingUser)
  const user = useSelector(getUser)
  const userLinks = useSelector(getUserResourceLinks)
  const dispatch = useDispatch()
  const match = useRouteMatch()
  const resourceAccessMap = new Map<string, ResourceLinkType>([
    ['/create/:patientId?', ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE],
    ['/search', ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE],
    ['/list/draft', ResourceLinkType.ACCESS_DRAFT_LIST],
    ['/list/certificate', ResourceLinkType.ACCESS_SIGNED_CERTIFICATES_LIST],
    ['/list/unhandledcertificates', ResourceLinkType.ACCESS_UNHANDLED_CERTIFICATES],
  ])
  const linkType = resourceAccessMap.get(match.path)

  const showSpinner = isLoadingUser

  useEffect(() => {
    if (!isLoadingUser && (!user || !linkType || !userLinks.some((link) => link.type === linkType))) {
      dispatch(throwError({ type: ErrorType.ROUTE, errorCode: ErrorCode.AUTHORIZATION_PROBLEM_RESOURCE }))
    }
  }, [isLoadingUser, user, linkType, userLinks, dispatch])

  return (
    <SpinnerBackdrop open={showSpinner} spinnerText="Laddar...">
      {children}
    </SpinnerBackdrop>
  )
}
