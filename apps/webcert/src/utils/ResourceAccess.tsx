import type React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SpinnerBackdrop from '../components/utils/SpinnerBackdrop'
import { throwError } from '../store/error/errorActions'
import { ErrorCode, ErrorType } from '../store/error/errorReducer'
import { getUser, getUserResourceLinks, selectIsLoadingUser } from '../store/user/userSelectors'
import type { ResourceLinkType } from '../types'

interface Props {
  linkType: ResourceLinkType
}

export const ResourceAccess: React.FC<Props> = ({ children, linkType }) => {
  const isLoadingUser = useSelector(selectIsLoadingUser)
  const user = useSelector(getUser)
  const userLinks = useSelector(getUserResourceLinks)
  const dispatch = useDispatch()

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
