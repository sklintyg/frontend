import { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { PageContainer } from '../../components/PageContainer/PageContainer'
import { EmptyTableAlert } from '../../components/Table/EmptyTableAlert'
import { Table } from '../../components/Table/Table'
import { TableHeadingForUnit } from '../../components/Table/heading/TableHeadingForUnit'
import { TableHeader } from '../../components/Table/tableHeader/TableHeader'
import { TableDescriptionDialog } from '../../components/dialog/TableDescriptionDialog'
import { TableContentAlert } from '../../components/error/ErrorAlert/TableContentAlert'
import { UserUrval } from '../../schemas'
import { useGetUserQuery } from '../../store/api'
import { useAppSelector } from '../../store/hooks'
import { useGetSickLeavesFiltersQuery, useLazyGetSickLeavesQuery } from '../../store/sickLeaveApi'
import { SickLeaveColumn } from '../../store/slices/sickLeaveTableColumns.slice'
import { CurrentSickLeavesFilters } from './components/CurrentSickLeavesFilters'
import { CurrentSickLeavesTableInfo } from './components/CurrentSickLeavesTableInfo'
import { PrintTable } from './components/PrintTable'
import { TableBodyRows } from './components/TableBodyRows'
import { useSickLeavesTableColumn } from './hooks/useSickLeavesTableColumns'

export function CurrentSickLeaves() {
  const { isLoading: userLoading, data: user } = useGetUserQuery()
  const { data: populatedFilters } = useGetSickLeavesFiltersQuery()
  const [triggerGetSickLeaves, { isLoading: currentSickLeaveLoading, data: currentSickLeavesInfo, error }] = useLazyGetSickLeavesQuery()
  const showPersonalInformation = useAppSelector((state) => state.settings.showPersonalInformation)
  const { encryptedPatientId } = useParams()
  const [tableState, setTableState] = useState<{ sortColumn: string; ascending: boolean }>({
    sortColumn: SickLeaveColumn.Startdatum,
    ascending: false,
  })
  const isLoading = userLoading || currentSickLeaveLoading
  const isDoctor = user?.urval === UserUrval.ISSUED_BY_ME
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
          <CurrentSickLeavesTableInfo
            totalNumber={populatedFilters?.nbrOfSickLeaves ?? 0}
            listLength={(sickLeaves ?? []).length}
            daysAfterSickLeaveEnd={user?.preferences?.maxAntalDagarSedanSjukfallAvslut ?? ''}
            daysBetweenCertificates={user?.preferences?.maxAntalDagarMellanIntyg ?? ''}
            communicationError={currentSickLeavesInfo?.unansweredCommunicationError}
          />
          <Table
            header={<TableHeader columns={columns} />}
            sortColumn={tableState.sortColumn}
            onSortChange={setTableState}
            print={<PrintTable sickLeaves={sickLeaves} showPersonalInformation={showPersonalInformation} />}
            ascending={tableState.ascending}
          >
            <tbody className="whitespace-normal break-words">
              <TableBodyRows
                isDoctor={isDoctor}
                isLoading={isLoading}
                showPersonalInformation={showPersonalInformation}
                sickLeaves={sickLeaves}
                user={user}
              />
            </tbody>
          </Table>
          <TableDescriptionDialog columns={columns} />
        </>
      )}
    </PageContainer>
  )
}
