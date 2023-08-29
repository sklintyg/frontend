import { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { PageContainer } from '../../components/PageContainer/PageContainer'
import { EmptyTableAlert } from '../../components/Table/EmptyTableAlert'
import { Table } from '../../components/Table/Table'
import { TableHeadingForUnit } from '../../components/Table/heading/TableHeadingForUnit'
import { TableHeader } from '../../components/Table/tableHeader/TableHeader'
import { TableContentAlert } from '../../components/error/ErrorAlert/TableContentAlert'
import { UserUrval } from '../../schemas'
import { useGetUserQuery } from '../../store/api'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useGetSickLeavesFiltersQuery, useLazyGetSickLeavesQuery } from '../../store/sickLeaveApi'
import { resetSickLeaveFilters } from '../../store/slices/sickLeave.slice'
import { SickLeaveColumn } from '../../store/slices/sickLeaveTableColumns.slice'
import { CurrentSickLeavesTableInfo } from './components/CurrentSickLeavesTableInfo'
import { Filters } from './components/Filters'
import { PrintTable } from './components/PrintTable'
import { TableBodyRows } from './components/TableBodyRows'
import { useSickLeavesTableColumn } from './hooks/useSickLeavesTableColumns'
import { TableDescriptionDialog } from '../../components/dialog/TableDescriptionDialog'

export function CurrentSickLeaves() {
  const { isLoading: userLoading, data: user } = useGetUserQuery()
  const { data: populatedFilters } = useGetSickLeavesFiltersQuery()
  const [triggerGetSickLeaves, { isLoading: currentSickLeaveLoading, data: currentSickLeavesInfo, error }] = useLazyGetSickLeavesQuery()
  const { showPersonalInformation } = useAppSelector((state) => state.settings)
  const { encryptedPatientId } = useParams()
  const [tableState, setTableState] = useState<{ sortColumn: string; ascending: boolean }>({
    sortColumn: SickLeaveColumn.Startdatum,
    ascending: true,
  })
  const dispatch = useAppDispatch()
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
      <Filters
        onSearch={(request) => triggerGetSickLeaves(request)}
        onReset={() => {
          dispatch(resetSickLeaveFilters())
        }}
        isDoctor={isDoctor}
      />
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
