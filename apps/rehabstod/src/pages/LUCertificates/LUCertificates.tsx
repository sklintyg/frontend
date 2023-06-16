import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { TableHeadingForUnit } from '../../components/Table/heading/TableHeadingForUnit'
import { useGetUserQuery, useLazyGetLUCertificatesQuery } from '../../store/api'
import { LUCertificatesFilters } from './LUCertificatesFilters'
import { TableLayout } from '../../components/Table/TableLayout'
import { reset } from '../../store/slices/luCertificates.slice'
import { Table } from '../../components/Table/Table'
import { LUCertificatesColumn } from '../../store/slices/luCertificatesTableColumns.slice'
import { TableHeader } from '../../components/Table/TableHeader'
import { useAppSelector } from '../../store/hooks'
import { allLuCertificatesColumns } from '../../store/slices/luCertificatesTableColumns.selector'
import { getLUCertificatesColumnInfo } from './utils/getLUCertificatesColumnsInfo'
import { TableInfoMessage } from '../../components/Table/TableInfoMessage'
import { TableBody } from '../../components/Table/TableBody'
import { getLUCertificatesTableCell, getLUCertificatesTableValue } from './utils/luCertificatesTableValueFormatter'
import { isUserDoctor } from '../../utils/isUserDoctor'

export function LUCertificates() {
  const { isLoading: userLoading, data: user } = useGetUserQuery()
  const [triggerGetLUCertificates, { isLoading: isContentLoading, data: luCertificatesInfo }] = useLazyGetLUCertificatesQuery()
  const allColumns = useAppSelector(allLuCertificatesColumns)
  const dispatch = useDispatch()
  const [tableState, setTableState] = useState<{ sortColumn: string; ascending: boolean }>({
    sortColumn: LUCertificatesColumn.Signeringsdatum,
    ascending: false,
  })
  const { hasAppliedFilters } = useAppSelector((state) => state.luCertificates)

  const isDoctor = isUserDoctor(user)

  const SEARCH_TABLE_TEXT = `Tryck på Sök för att visa ${
    isDoctor ? 'alla dina' : 'alla'
  }  läkarutlåtanden för enheten, eller ange filterval och tryck på Sök för att visa urval av läkarutlåtanden. Läkarutlåtanden som signerats de senaste tre åren på enheten visas.`
  const EMPTY_TABLE_TEXT = `${isDoctor ? 'Du har' : 'Det finns'} inga läkarutlåtanden på ${user.valdVardenhet.namn}`
  const EMPTY_FILTRATION_TEXT = 'Inga läkarutlåtanden matchade filtreringen.'

  return (
    <TableLayout
      isUserLoading={userLoading}
      user={user}
      onReset={() => dispatch(reset())}
      heading={<TableHeadingForUnit tableName="läkarutlåtanden" suffix="senaste tre åren" user={user} />}
      filters={<LUCertificatesFilters onSearch={(request) => triggerGetLUCertificates(request)} />}
      tableInfo={<></>}
      error={false}
      errorTitle=""
      errorText=""
    >
      <Table sortColumn={tableState.sortColumn} onSortChange={setTableState} ascending={tableState.ascending}>
        <TableHeader columns={allColumns.map((column) => getLUCertificatesColumnInfo(column.name))} />
        <TableInfoMessage
          isLoading={isContentLoading}
          tableLength={allColumns.length}
          searchText={SEARCH_TABLE_TEXT}
          emptyTableFromFiltrationText={EMPTY_FILTRATION_TEXT}
          emptyTableText={EMPTY_TABLE_TEXT}
          content={luCertificatesInfo ? luCertificatesInfo.certificates : null}
          hasAppliedFilters={hasAppliedFilters}
        />
        <TableBody
          content={luCertificatesInfo ? luCertificatesInfo.certificates : []}
          tableValueExtractor={getLUCertificatesTableValue}
          tableCellExtractor={getLUCertificatesTableCell}
          columns={allColumns}
          keyIndex="patient.id"
        />
      </Table>
    </TableLayout>
  )
}
