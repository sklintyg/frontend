import type React from 'react'
import { useEffect } from 'react'
import SpinnerBackdrop from '../components/utils/SpinnerBackdrop'
import { throwError } from '../store/error/errorActions'
import { ErrorCode, ErrorType } from '../store/error/errorReducer'
import { useAppDispatch, useAppSelector } from '../store/store'
import { getUser, getUserResourceLinks, selectIsLoadingUser } from '../store/user/userSelectors'
import type { ResourceLinkType } from '../types'

interface Props {
  linkType: ResourceLinkType
}

export const ResourceAccess: React.FC<Props> = ({ children, linkType }) => {
  const isLoadingUser = useAppSelector(selectIsLoadingUser)
  const user = useAppSelector(getUser)
  const userLinks = useAppSelector(getUserResourceLinks)
  const dispatch = useAppDispatch()

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
