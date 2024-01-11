import { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { LUCertificatesFilters } from './components/LUCertificatesFilters'
import { LUCertificatesTableBody } from './components/LUCertificatesTableBody'
import { ModifyLUCertificatesTableColumns } from './components/ModifyLUCertificatesTableColumns'
import { getLUCertificatesColumnInfo } from './utils/getLUCertificatesColumnsInfo'
import { TableContentAlert } from '../../components/error/ErrorAlert/TableContentAlert'
import { PageContainer } from '../../components/PageContainer/PageContainer'
import { EmptyTableAlert } from '../../components/Table/EmptyTableAlert'
import { TableHeadingForUnit } from '../../components/Table/heading/TableHeadingForUnit'
import { Table } from '../../components/Table/Table'
import { TableHeader } from '../../components/Table/tableHeader/TableHeader'
import { TableInfo } from '../../components/Table/TableInfo/TableInfo'
import { TableRowsInfoItem } from '../../components/Table/TableInfo/TableRowsInfoItem'
import { TableInfoMessage } from '../../components/Table/TableInfoMessage'
import { filterHiddenColumns, filterTableColumn, filterTableColumns } from '../../components/Table/utils/filterTableColumns'
import { useGetUserQuery } from '../../store/api'
import { useAppSelector } from '../../store/hooks'
import { useGetLUFiltersQuery, useLazyGetLUCertificatesQuery } from '../../store/luApi'
import { allLUUnitTableColumns } from '../../store/slices/luUnitTableColumns.selector'
import { LUCertificatesColumn } from '../../store/slices/luUnitTableColumns.slice'
import { isUserDoctor } from '../../utils/isUserDoctor'

export function LUCertificates() {
  const { encryptedPatientId } = useParams()
  const { data: user } = useGetUserQuery()
  const [triggerGetLUCertificates, { isLoading: isContentLoading, data: luCertificatesInfo, error }] = useLazyGetLUCertificatesQuery()
  const allColumns = useAppSelector(allLUUnitTableColumns)
  const [tableState, setTableState] = useState<{ sortColumn: string; ascending: boolean }>({
    sortColumn: LUCertificatesColumn.Signeringsdatum,
    ascending: false,
  })
  const { data: populatedFilters } = useGetLUFiltersQuery()
  const hasAppliedFilters = useAppSelector((state) => state.luCertificatesFilter.hasAppliedFilters)
  const showPersonalInformation = useAppSelector((state) => state.settings.showPersonalInformation)

  const isDoctor = user ? isUserDoctor(user) : false
  const filteredColumns = filterTableColumns(allColumns, isDoctor, showPersonalInformation, false, undefined, [
    LUCertificatesColumn.Intyg,
    LUCertificatesColumn.Vårdgivare,
    LUCertificatesColumn.Vårdenhet,
  ])
  const visibleColumns = filterHiddenColumns(filteredColumns)
  const unansweredCommunicationError = !!luCertificatesInfo?.questionAndAnswersError
  const emptyTableAlert = populatedFilters && populatedFilters.doctors.length === 0

  const TABLE_NAME = 'läkarutlåtanden'

  if (encryptedPatientId) {
    return <Outlet />
  }

  return (
    <PageContainer>
      <TableHeadingForUnit tableName={TABLE_NAME} suffix="senaste tre åren" user={user} />
      <LUCertificatesFilters onSearch={triggerGetLUCertificates} />
      {emptyTableAlert && <EmptyTableAlert tableName={TABLE_NAME} />}
      {error && <TableContentAlert tableName={TABLE_NAME} error={error} />}
      {!error && (
        <>
          <TableInfo
            communicationError={unansweredCommunicationError}
            modifyTable={<ModifyLUCertificatesTableColumns columns={filterTableColumn(filteredColumns, LUCertificatesColumn.Index)} />}
          >
            <TableRowsInfoItem
              listLength={luCertificatesInfo?.certificates.length ?? 0}
              totalNumber={luCertificatesInfo?.certificates.length ?? 0} // TODO: this should come from backend
            />
          </TableInfo>
          <Table
            header={<TableHeader columns={visibleColumns.map((column) => getLUCertificatesColumnInfo(column.name))} />}
            sortColumn={tableState.sortColumn}
            onSortChange={setTableState}
            ascending={tableState.ascending}
          >
            <TableInfoMessage
              isLoading={isContentLoading}
              tableLength={visibleColumns.length}
              tableName={TABLE_NAME}
              suffix="Läkarutlåtanden som signerats de senaste tre åren på enheten visas."
              user={user}
              content={luCertificatesInfo?.certificates ?? null}
              hasAppliedFilters={hasAppliedFilters}
            />
            <LUCertificatesTableBody focusable clickable content={luCertificatesInfo?.certificates ?? []} columns={visibleColumns} />
          </Table>
        </>
      )}
    </PageContainer>
  )
}
