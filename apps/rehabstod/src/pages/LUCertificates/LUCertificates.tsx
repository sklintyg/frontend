import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useParams } from 'react-router-dom'
import { Table } from '../../components/Table/Table'
import { TableInfo } from '../../components/Table/TableInfo'
import { TableInfoMessage } from '../../components/Table/TableInfoMessage'
import { TablePageLayout } from '../../components/Table/TablePageLayout'
import { TableHeadingForUnit } from '../../components/Table/heading/TableHeadingForUnit'
import { TableHeader } from '../../components/Table/tableHeader/TableHeader'
import { filterHiddenColumns, filterTableColumns } from '../../components/Table/utils/filterTableColumns'
import { useNavigateToStartPage } from '../../hooks/useNavigateToStartPage'
import { useGetLUFiltersQuery, useGetUserQuery, useLazyGetLUCertificatesQuery } from '../../store/api'
import { useAppSelector } from '../../store/hooks'
import { reset } from '../../store/slices/luCertificates.slice'
import { allLUUnitTableColumns } from '../../store/slices/luUnitTableColumns.selector'
import { LUCertificatesColumn } from '../../store/slices/luUnitTableColumns.slice'
import { updateShowPersonalInformation } from '../../store/slices/settings.slice'
import { isUserDoctor } from '../../utils/isUserDoctor'
import { LUCertificatesFilters } from './LUCertificatesFilters'
import { LUCertificatesTableBody } from './LUCertificatesTableBody'
import { ModifyLUCertificatesTableColumns } from './ModifyLUCertificatesTableColumns'
import { getLUCertificatesColumnInfo } from './utils/getLUCertificatesColumnsInfo'
import { FixedTableHeader } from '../CurrentSickLeaves/components/FixedTableHeader'

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
  const { hasAppliedFilters } = useAppSelector((state) => state.luCertificates)
  const { showPersonalInformation } = useAppSelector((state) => state.settings)
  const dispatch = useDispatch()

  const isDoctor = user ? isUserDoctor(user) : false
  const filteredColumns = filterTableColumns(allColumns, isDoctor, showPersonalInformation, false, undefined, [
    LUCertificatesColumn.Visa,
    LUCertificatesColumn.Vårdgivare,
    LUCertificatesColumn.Vårdenhet,
    LUCertificatesColumn.Index,
  ])
  const visibleColumns = filterHiddenColumns(filteredColumns)

  const TABLE_NAME = 'läkarutlåtanden'

  useEffect(
    () => () => {
      dispatch(reset())
    },
    [dispatch]
  )

  useNavigateToStartPage()

  if (encryptedPatientId) {
    return <Outlet />
  }

  return (
    <TablePageLayout
      printable={false}
      tableName={TABLE_NAME}
      heading={<TableHeadingForUnit tableName={TABLE_NAME} suffix="senaste tre åren" user={user} />}
      filters={<LUCertificatesFilters onSearch={(request) => triggerGetLUCertificates(request)} />}
      tableInfo={
        <TableInfo
          listLength={luCertificatesInfo ? luCertificatesInfo.certificates.length : 0}
          totalNumber={luCertificatesInfo ? luCertificatesInfo.certificates.length : 0} // TODO: this should come from backend
          showPersonalInformation={showPersonalInformation} // TODO: should be shared with sickleaves
          onShowPersonalInformationChange={(checked) => dispatch(updateShowPersonalInformation(checked))}
        />
      }
      modifyTableColumns={<ModifyLUCertificatesTableColumns columns={filteredColumns} />}
      tableContentError={error}
      unansweredCommunicationError={!!luCertificatesInfo?.questionAndAnswersError}
      emptyTableAlert={populatedFilters && populatedFilters.doctors.length === 0}
    >
      <Table sortColumn={tableState.sortColumn} onSortChange={setTableState} ascending={tableState.ascending}>
        <FixedTableHeader bottomMargin={50}>
          <TableHeader columns={visibleColumns.map((column) => getLUCertificatesColumnInfo(column.name))} />
        </FixedTableHeader>
        <TableInfoMessage
          isLoading={isContentLoading}
          tableLength={visibleColumns.length}
          tableName={TABLE_NAME}
          suffix="Läkarutlåtanden som signerats de senaste tre åren på enheten visas."
          user={user}
          content={luCertificatesInfo ? luCertificatesInfo.certificates : null}
          hasAppliedFilters={hasAppliedFilters}
        />
        <LUCertificatesTableBody
          focusable
          clickable
          content={luCertificatesInfo ? luCertificatesInfo.certificates : []}
          columns={visibleColumns}
        />
      </Table>
    </TablePageLayout>
  )
}
