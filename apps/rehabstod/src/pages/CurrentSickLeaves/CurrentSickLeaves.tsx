import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { PrintButton } from '../../components/PrintButton/PrintButton'
import { EmptyTableAlert } from '../../components/Table/EmptyTableAlert'
import { Table } from '../../components/Table/Table'
import { TableHeadingForUnit } from '../../components/Table/heading/TableHeadingForUnit'
import { TableHeader } from '../../components/Table/tableHeader/TableHeader'
import { TableContentAlert } from '../../components/error/ErrorAlert/TableContentAlert'
import { UnansweredCommunicationAlert } from '../../components/error/ErrorAlert/UnansweredCommunicationAlert'
import { UserUrval } from '../../schemas'
import { useGetUserQuery } from '../../store/api'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useGetSickLeavesFiltersQuery, useLazyGetSickLeavesQuery } from '../../store/sickLeaveApi'
import { updateShowPersonalInformation } from '../../store/slices/settings.slice'
import { resetSickLeaveFilters } from '../../store/slices/sickLeave.slice'
import { SickLeaveColumn } from '../../store/slices/sickLeaveTableColumns.slice'
import { CurrentSickLeavesTableInfo } from './components/CurrentSickLeavesTableInfo'
import { Filters } from './components/Filters'
import { ModifySicknessTableColumns } from './components/ModifySicknessTableColumns'
import { PrintTable } from './components/PrintTable'
import { TableBodyRows } from './components/TableBodyRows'
import { useSickLeavesTableColumn } from './hooks/useSickLeavesTableColumns'

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
  const navigate = useNavigate()
  const sickLeaves = currentSickLeavesInfo ? currentSickLeavesInfo.content : undefined
  const columns = useSickLeavesTableColumn()

  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/')
    }
  }, [user, userLoading, navigate])

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
    <div className="ids-content m-auto max-w-7xl py-10 px-2.5">
      <TableHeadingForUnit user={user} tableName="pågående sjukfall" />
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
        <div>
          <div className="pb-10">{currentSickLeavesInfo?.unansweredCommunicationError && <UnansweredCommunicationAlert />}</div>
          <div className="flex">
            <div className="w-full">
              <CurrentSickLeavesTableInfo
                onShowPersonalInformationChange={(checked) => {
                  dispatch(updateShowPersonalInformation(checked))
                }}
                showPersonalInformation={showPersonalInformation}
                totalNumber={populatedFilters?.nbrOfSickLeaves ?? 0}
                listLength={(sickLeaves ?? []).length}
                daysAfterSickLeaveEnd={user?.preferences?.maxAntalDagarSedanSjukfallAvslut ?? ''}
                daysBetweenCertificates={user?.preferences?.maxAntalDagarMellanIntyg ?? ''}
              />
            </div>

            <div className="mb-5 flex items-end gap-3 print:hidden">
              <div className="w-96">
                <ModifySicknessTableColumns />
              </div>
              <PrintButton />
            </div>
          </div>
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
        </div>
      )}
    </div>
  )
}
