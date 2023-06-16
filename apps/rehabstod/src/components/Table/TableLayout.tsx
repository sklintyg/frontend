import { useNavigate } from 'react-router-dom'
import { ReactNode, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { User } from '../../schemas'
import { DisplayError } from '../../error/DisplayError'

export function TableLayout({
  isUserLoading,
  user,
  onReset,
  heading,
  filters,
  tableInfo,
  modifyTableColumns,
  error,
  errorTitle,
  errorText,
  children,
}: {
  isUserLoading: boolean
  user: User
  onReset: () => void
  heading: ReactNode
  filters: ReactNode
  tableInfo: ReactNode
  modifyTableColumns: ReactNode
  error: boolean
  errorTitle: string
  errorText: string
  children: ReactNode
}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isUserLoading && !user) {
      navigate('/')
    }
  }, [user, isUserLoading, navigate])

  useEffect(
    () => () => {
      dispatch(onReset)
    },
    [dispatch, onReset]
  )

  return (
    <div className="ids-content m-auto max-w-7xl py-10 px-2.5">
      {heading}
      {filters}
      {error && <DisplayError heading={errorTitle} errorType="error" text={errorText} dynamicLink />}
      {!error && (
        <div>
          <div className="flex">
            <div className="w-full">{tableInfo}</div>
            <div className="w-96">{modifyTableColumns}</div>
          </div>
          {children}
        </div>
      )}
    </div>
  )
}
