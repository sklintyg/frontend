import { useNavigate } from 'react-router-dom'
import { ReactNode, useEffect } from 'react'
import { IDSButton } from '@frontend/ids-react-ts'
import { User } from '../../schemas'
import { DisplayError } from '../../error/DisplayError'

export function TableLayout({
  isUserLoading,
  user,
  heading,
  filters,
  tableInfo,
  modifyTableColumns,
  error,
  errorTitle,
  errorText,
  printable,
  children,
}: {
  isUserLoading: boolean
  user: User
  heading: ReactNode
  filters: ReactNode
  tableInfo: ReactNode
  modifyTableColumns: ReactNode
  error: boolean
  errorTitle: string
  errorText: string
  printable: boolean
  children: ReactNode
}) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isUserLoading && !user) {
      navigate('/')
    }
  }, [user, isUserLoading, navigate])

  return (
    <div className="ids-content m-auto max-w-7xl py-10 px-2.5">
      {heading}
      <h3 className="ids-heading-4 hidden print:block">Valda filter</h3>
      {filters}
      {error && <DisplayError heading={errorTitle} errorType="error" text={errorText} dynamicLink />}
      {!error && (
        <div>
          <div className="flex">
            <div className="w-full">{tableInfo}</div>
            <div className="mb-5 flex items-end gap-3 print:hidden">
              <div className="w-96">{modifyTableColumns}</div>
              {printable && (
                <IDSButton onClick={() => window.print()} className="mb-3 whitespace-nowrap">
                  Skriv ut
                </IDSButton>
              )}
            </div>
          </div>
          {children}
        </div>
      )}
    </div>
  )
}
