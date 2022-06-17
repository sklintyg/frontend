import React from 'react'
import { Backdrop, ResourceLinkType } from '@frontend/common'
import { getUser, getUserResourceLinks, selectIsLoadingUser } from '../store/user/userSelectors'
import { useDispatch, useSelector } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'
import { ErrorCode, ErrorType } from '../store/error/errorReducer'
import { throwError } from '../store/error/errorActions'

export function withResourceAccess<P>(WrappedComponent: React.FC<P>): React.FC<P> {
  return (props: P) => {
    const isLoadingUser = useSelector(selectIsLoadingUser)
    const user = useSelector(getUser)
    const userLinks = useSelector(getUserResourceLinks)
    const dispatch = useDispatch()
    const match = useRouteMatch()
    const resourceAccessMap = new Map<string, ResourceLinkType>([
      ['/create/:patientId?', ResourceLinkType.ACCESS_SEARCH_CREATE_PAGE],
      ['/list/draft', ResourceLinkType.ACCESS_DRAFT_LIST],
      ['/list/certificate', ResourceLinkType.ACCESS_SIGNED_CERTIFICATES_LIST],
      ['/list/question', ResourceLinkType.ACCESS_QUESTION_LIST],
    ])
    const linkType = resourceAccessMap.get(match.path)

    let showSpinner = isLoadingUser

    if (!isLoadingUser && (!user || !linkType || !userLinks.some((link) => link.type === linkType))) {
      dispatch(throwError({ type: ErrorType.ROUTE, errorCode: ErrorCode.AUTHORIZATION_PROBLEM_RESOURCE }))
      showSpinner = true
    }

    return (
      <Backdrop open={showSpinner} spinnerText="Laddar...">
        <WrappedComponent {...props} />
      </Backdrop>
    )
  }
}
