import { ReactNode } from 'react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { IDSAlert } from '@frontend/ids-react-ts'
import { UnansweredCommunicationAlert } from '../error/ErrorAlert/UnansweredCommunicationAlert'
import { TableContentAlert } from '../error/ErrorAlert/TableContentAlert'
import { PrintButton } from '../PrintButton/PrintButton'
import { PageContainer } from '../PageContainer/PageContainer'
import { useGetDoctorsForLUCertificatesQuery, useGetUserQuery } from '../../store/api'
import { isUserDoctor } from '../../utils/isUserDoctor'

export function TablePageLayout({
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
  const { data: doctorsFilterResponse } = useGetDoctorsForLUCertificatesQuery()
  const { data: user } = useGetUserQuery()
  const isDoctor = user ? isUserDoctor(user) : false

  function noDoctorsForLU() {
    return doctorsFilterResponse && doctorsFilterResponse?.doctors.length === 0
  }

  return (
    <PageContainer>
      {heading}
      {filters}
      {noDoctorsForLU() && (
        <IDSAlert className="py-10">
          {isDoctor ? 'Du har' : 'Det finns'} inga läkarutlåtanden på {user && user.valdVardenhet ? user.valdVardenhet.namn : ''}.
        </IDSAlert>
      )}
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
    </PageContainer>
  )
}
