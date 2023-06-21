import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TableHeadingForUnit } from '../../components/Table/heading/TableHeadingForUnit'
import { useGetUserQuery, useLazyGetLUCertificatesQuery } from '../../store/api'
import { LUCertificatesFilters } from './LUCertificatesFilters'
import { TableLayout } from '../../components/Table/TableLayout'
import { reset } from '../../store/slices/luCertificates.slice'
import { Table } from '../../components/Table/Table'
import { LUCertificatesColumn } from '../../store/slices/luCertificatesTableColumns.slice'
import { TableHeader } from '../../components/Table/tableHeader/TableHeader'
import { useAppSelector } from '../../store/hooks'
import { allLuCertificatesColumns } from '../../store/slices/luCertificatesTableColumns.selector'
import { getLUCertificatesColumnInfo } from './utils/getLUCertificatesColumnsInfo'
import { TableInfoMessage } from '../../components/Table/TableInfoMessage'
import { TableBody } from '../../components/Table/tableBody/TableBody'
import { getLUCertificatesId, getLUCertificatesTableCell, getLUCertificatesTableValue } from './utils/luCertificatesTableValueFormatter'
import { isUserDoctor } from '../../utils/isUserDoctor'
import { filterTableColumns } from '../../components/Table/utils/filterTableColumns'
import { TableInfo } from '../../components/Table/TableInfo'
import { ModifyLUCertificatesTableColumns } from './ModifyLUCertificatesTableColumns'
import { PrintTableBody } from '../../components/Table/tableBody/PrintableTableBody'
import { updateShowPersonalInformation } from '../../store/slices/settings.slice'

export function LUCertificates() {
  const { data: user } = useGetUserQuery()
  const [triggerGetLUCertificates, { isLoading: isContentLoading, data: luCertificatesInfo, error }] = useLazyGetLUCertificatesQuery()
  const allColumns = useAppSelector(allLuCertificatesColumns)
  const [tableState, setTableState] = useState<{ sortColumn: string; ascending: boolean }>({
    sortColumn: LUCertificatesColumn.Signeringsdatum,
    ascending: false,
  })
  const { hasAppliedFilters } = useAppSelector((state) => state.luCertificates)
  const { showPersonalInformation } = useAppSelector((state) => state.settings)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isDoctor = user ? isUserDoctor(user) : false
  const visibleColumns = filterTableColumns(allColumns, isDoctor, showPersonalInformation, true)

  const TABLE_NAME = 'läkarutlåtanden'

  const navigateToPatient = (id: string) => {
    navigate(`/pagaende-sjukfall/${id}`)
  }

  useEffect(
    () => () => {
      dispatch(reset())
    },
    [dispatch]
  )

  return (
    <TableLayout
      printable
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
      modifyTableColumns={<ModifyLUCertificatesTableColumns />}
      tableContentError={error}
      unansweredCommunicationError={!!luCertificatesInfo?.questionAndAnswersError}
    >
      <Table
        sortColumn={tableState.sortColumn}
        onSortChange={setTableState}
        ascending={tableState.ascending}
        print={
          <PrintTableBody
            content={luCertificatesInfo ? luCertificatesInfo.certificates : []}
            tableValueExtractor={getLUCertificatesTableValue}
            tableCellExtractor={getLUCertificatesTableCell}
            columns={visibleColumns}
            keyIndex="patient"
          />
        }
      >
        <TableHeader columns={visibleColumns.map((column) => getLUCertificatesColumnInfo(column.name))} />
        <TableInfoMessage
          isLoading={isContentLoading}
          tableLength={visibleColumns.length}
          tableName={TABLE_NAME}
          suffix="Läkarutlåtanden som signerats de senaste tre åren på enheten visas."
          user={user}
          content={luCertificatesInfo ? luCertificatesInfo.certificates : null}
          hasAppliedFilters={hasAppliedFilters}
        />
        <TableBody
          content={luCertificatesInfo ? luCertificatesInfo.certificates : []}
          tableValueExtractor={getLUCertificatesTableValue}
          tableCellExtractor={getLUCertificatesTableCell}
          tableIdExtractor={getLUCertificatesId}
          columns={visibleColumns}
          onTableRowClick={(id) => navigateToPatient(id)}
        />
      </Table>
    </TableLayout>
  )
}
