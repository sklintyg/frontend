import { useNavigate } from 'react-router-dom'
import { ReactNode, useEffect } from 'react'
import { IDSButton } from '@frontend/ids-react-ts'
import { User } from '../../schemas'
import { UnansweredCommunicationError } from '../error/UnansweredCommunicationError/UnansweredCommunicationError'
import { GetTableContentError } from '../error/GetTableContentError/GetTableContentError'

export function TableLayout({
  isUserLoading,
  user,
  heading,
  filters,
  tableInfo,
  modifyTableColumns,
  error,
  unansweredCommunicationError,
  printable,
  tableName,
  children,
}: {
  isUserLoading: boolean
  user: User | undefined
  heading: ReactNode
  filters: ReactNode
  tableInfo: ReactNode
  modifyTableColumns: ReactNode
  error: boolean
  unansweredCommunicationError?: boolean
  tableName: string
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
      {error ? (
        <GetTableContentError tableName={tableName} />
      ) : (
        <div>
          <div className="pb-10">{unansweredCommunicationError && <UnansweredCommunicationError />}</div>
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
