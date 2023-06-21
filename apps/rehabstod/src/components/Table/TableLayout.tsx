import { ReactNode } from 'react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { UnansweredCommunicationAlert } from '../error/ErrorAlert/UnansweredCommunicationAlert'
import { TableContentAlert } from '../error/ErrorAlert/TableContentAlert'
import { PrintButton } from '../PrintButton/PrintButton'
import { useNavigateToStartPage } from '../../hooks/useNavigateToStartPage'

export function TableLayout({
  heading,
  filters,
  tableInfo,
  modifyTableColumns,
  tableContentError,
  unansweredCommunicationError,
  printable,
  tableName,
  children,
}: {
  heading: ReactNode
  filters: ReactNode
  tableInfo: ReactNode
  modifyTableColumns: ReactNode
  tableContentError?: (FetchBaseQueryError & { id?: string }) | (SerializedError & { id?: string })
  unansweredCommunicationError?: boolean
  tableName: string
  printable: boolean
  children: ReactNode
}) {
  useNavigateToStartPage()

  return (
    <div className="ids-content m-auto max-w-7xl py-10 px-2.5">
      {heading}
      {filters}
      {tableContentError ? (
        <TableContentAlert tableName={tableName} error={tableContentError} />
      ) : (
        <div>
          <div className="pb-10">{unansweredCommunicationError && <UnansweredCommunicationAlert />}</div>
          <div className="flex">
            <div className="w-full">{tableInfo}</div>
            <div className="mb-5 flex items-end gap-3 print:hidden">
              <div className="w-96">{modifyTableColumns}</div>
              {printable && <PrintButton />}
            </div>
          </div>
          {children}
        </div>
      )}
    </div>
  )
}
