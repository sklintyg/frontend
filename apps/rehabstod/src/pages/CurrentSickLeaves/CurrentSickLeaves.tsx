import { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { CurrentSickLeavesFilters } from './components/CurrentSickLeavesFilters'
import { CurrentSickLeavesTableInfo } from './components/CurrentSickLeavesTableInfo'
import { ModifySicknessTableColumns } from './components/ModifySicknessTableColumns'
import { PrintTable } from './components/PrintTable'
import { TableBodyRows } from './components/TableBodyRows'
import { useSickLeavesTableColumn } from './hooks/useSickLeavesTableColumns'
import { TableDescriptionDialog } from '../../components/dialog/TableDescriptionDialog'
import { TableContentAlert } from '../../components/error/ErrorAlert/TableContentAlert'
import { PageContainer } from '../../components/PageContainer/PageContainer'
import { EmptyTableAlert } from '../../components/Table/EmptyTableAlert'
import { TableHeadingForUnit } from '../../components/Table/heading/TableHeadingForUnit'
import { Table } from '../../components/Table/Table'
import { TableHeader } from '../../components/Table/tableHeader/TableHeader'
import { TableInfo } from '../../components/Table/TableInfo/TableInfo'
import { useGetUserQuery } from '../../store/api'
import { useGetSickLeavesFiltersQuery, useLazyGetSickLeavesQuery } from '../../store/sickLeaveApi'
import { SickLeaveColumn } from '../../store/slices/sickLeaveTableColumns.slice'

export function CurrentSickLeaves() {
  const { isLoading: userLoading, data: user } = useGetUserQuery()
  const { data: populatedFilters } = useGetSickLeavesFiltersQuery()
  const [triggerGetSickLeaves, { isLoading: currentSickLeaveLoading, data: currentSickLeavesInfo, error }] = useLazyGetSickLeavesQuery()
  const { encryptedPatientId } = useParams()
  const [tableState, setTableState] = useState<{ sortColumn: string; ascending: boolean }>({
    sortColumn: SickLeaveColumn.Startdatum,
    ascending: false,
  })
  const isLoading = userLoading || currentSickLeaveLoading
  const sickLeaves = currentSickLeavesInfo ? currentSickLeavesInfo.content : undefined
  const columns = useSickLeavesTableColumn()

  if (encryptedPatientId) {
    return <Outlet />
  }

  const TABLE_NAME = 'pågående sjukfall'

  function hasOngoingSickLeaves() {
    if (!populatedFilters) {
      return true
    }
    return populatedFilters.hasOngoingSickLeaves
  }

  return (
    <PageContainer>
      <TableHeadingForUnit user={user} tableName={TABLE_NAME} />
      <CurrentSickLeavesFilters onSearch={triggerGetSickLeaves} />
      {!hasOngoingSickLeaves() && <EmptyTableAlert tableName={TABLE_NAME} />}
      {error && <TableContentAlert tableName="sjukfall" error={error} />}
      {!error && (
        <>
          <TableInfo
            printable
            communicationError={currentSickLeavesInfo?.unansweredCommunicationError}
            modifyTable={<ModifySicknessTableColumns />}
          >
            <CurrentSickLeavesTableInfo
              daysAfterSickLeaveEnd={user?.preferences?.maxAntalDagarSedanSjukfallAvslut ?? ''}
              daysBetweenCertificates={user?.preferences?.maxAntalDagarMellanIntyg ?? ''}
              listLength={(sickLeaves ?? []).length}
              totalNumber={populatedFilters?.nbrOfSickLeaves ?? 0}
            />
          </TableInfo>
          <Table
            header={<TableHeader columns={columns} />}
            sortColumn={tableState.sortColumn}
            onSortChange={setTableState}
            print={
              <PrintTable
                title="Pågående sjukfall på enheten"
                sickLeaves={sickLeaves}
                tableInfo={
                  <CurrentSickLeavesTableInfo
                    daysAfterSickLeaveEnd={user?.preferences?.maxAntalDagarSedanSjukfallAvslut ?? ''}
                    daysBetweenCertificates={user?.preferences?.maxAntalDagarMellanIntyg ?? ''}
                    listLength={(sickLeaves ?? []).length}
                    totalNumber={populatedFilters?.nbrOfSickLeaves ?? 0}
                  />
                }
              />
            }
            ascending={tableState.ascending}
          >
            <tbody className="whitespace-normal break-words">
              <TableBodyRows isLoading={isLoading} sickLeaves={sickLeaves} />
            </tbody>
          </Table>
          <TableDescriptionDialog columns={columns} />
        </>
      )}
    </PageContainer>
  )
}
