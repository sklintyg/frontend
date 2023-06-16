import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TableHeadingForUnit } from '../../components/Table/heading/TableHeadingForUnit'
import { useGetUserQuery, useLazyGetLUCertificatesQuery } from '../../store/api'
import { LUCertificatesFilters } from './LUCertificatesFilters'
import { TableLayout } from '../../components/Table/TableLayout'
import { reset, updateShowPersonalInformation } from '../../store/slices/luCertificates.slice'
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
import { filterTableColumns } from '../../components/Table/utils/filterTableColumns'
import { TableInfo } from '../../components/Table/TableInfo'
import { PatientInfo } from '../../schemas/patientSchema'
import { ModifyLUCertificatesTableColumns } from './ModifyLUCertificatesTableColumns'
import { PrintTableBody } from '../../components/Table/PrintableTableBody'

export function LUCertificates() {
  const { isLoading: userLoading, data: user } = useGetUserQuery()
  const [triggerGetLUCertificates, { isLoading: isContentLoading, data: luCertificatesInfo, error }] = useLazyGetLUCertificatesQuery()
  const allColumns = useAppSelector(allLuCertificatesColumns)
  const [tableState, setTableState] = useState<{ sortColumn: string; ascending: boolean }>({
    sortColumn: LUCertificatesColumn.Signeringsdatum,
    ascending: false,
  })
  const { hasAppliedFilters, showPersonalInformation } = useAppSelector((state) => state.luCertificates)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isDoctor = isUserDoctor(user)
  const visibleColumns = filterTableColumns(allColumns, isDoctor, showPersonalInformation, true)

  const SEARCH_TABLE_TEXT = `Tryck på Sök för att visa ${
    isDoctor ? 'alla dina' : 'alla'
  }  läkarutlåtanden för enheten, eller ange filterval och tryck på Sök för att visa urval av läkarutlåtanden. \nLäkarutlåtanden som signerats de senaste tre åren på enheten visas.`
  const EMPTY_TABLE_TEXT = `${isDoctor ? 'Du har' : 'Det finns'} inga läkarutlåtanden på ${user.valdVardenhet.namn}.`
  const EMPTY_FILTRATION_TEXT = 'Inga läkarutlåtanden matchade filtreringen.'

  const navigateToPatient = (id: string) => {
    navigate(`/pagaende-sjukfall/${id}`)
  }

  return (
    <TableLayout
      printable
      isUserLoading={userLoading}
      user={user}
      onReset={() => dispatch(reset())}
      heading={<TableHeadingForUnit tableName="läkarutlåtanden" suffix="senaste tre åren" user={user} />}
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
      error={error}
      errorTitle="Läkarutlåtanden för enheten kunde inte hämtas."
      errorText="Enhetens läkarutlåtanden kan inte visas på grund av ett tekniskt fel. Försök igen om en stund. Om felet kvarstår, kontakta i första hand din lokala IT-support och i andra hand "
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
          columns={visibleColumns}
          keyIndex="patient"
          onTableRowClick={(id) => navigateToPatient((id as PatientInfo).id)} // TODO: this should be switched to encrypted patient id
        />
      </Table>
    </TableLayout>
  )
}
