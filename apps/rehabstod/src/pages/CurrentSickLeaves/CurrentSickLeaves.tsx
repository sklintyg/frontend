import { IDSButton } from '@frontend/ids-react-ts'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { Table } from '../../components/Table/Table'
import { UserUrval } from '../../schemas'
import { useGetPopulatedFiltersQuery, useGetUserQuery, useLazyGetSickLeavesQuery } from '../../store/api'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { reset, resetFilters } from '../../store/slices/sickLeave.slice'
import { SickLeaveColumn } from '../../store/slices/sickLeaveTableColumns.slice'
import { Filters } from './components/Filters'
import { ModifySicknessTableColumns } from './components/ModifySicknessTableColumns'
import { PrintTable } from './components/PrintTable'
import { TableBodyRows } from './components/TableBodyRows'
import { TableHeaderRow } from './components/TableHeaderRow'
import { CurrentSickLeavesTableInfo } from './components/CurrentSickLeavesTableInfo'
import { updateShowPersonalInformation } from '../../store/slices/settings.slice'
import { UnansweredCommunicationAlert } from '../../components/error/ErrorAlert/UnansweredCommunicationAlert'
import { TableHeadingForUnit } from '../../components/Table/heading/TableHeadingForUnit'
import { TableContentAlert } from '../../components/error/ErrorAlert/TableContentAlert'

export function CurrentSickLeaves() {
  const { isLoading: userLoading, data: user } = useGetUserQuery()
  const { data: populatedFilters } = useGetPopulatedFiltersQuery()
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

  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/')
    }
  }, [user, userLoading, navigate])

  useEffect(
    () => () => {
      dispatch(reset())
    },
    [dispatch]
  )

  if (encryptedPatientId) {
    return <Outlet />
  }

  return (
    <div className="ids-content m-auto max-w-7xl py-10 px-2.5">
      <TableHeadingForUnit user={user} tableName="pågående sjukfall" />
      <h3 className="ids-heading-4 hidden print:block">Valda filter</h3>
      <Filters
        onSearch={(request) => triggerGetSickLeaves(request)}
        onReset={() => {
          dispatch(resetFilters())
        }}
        isDoctor={isDoctor}
      />
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
              <IDSButton onClick={() => window.print()} className="mb-3 whitespace-nowrap">
                Skriv ut
              </IDSButton>
            </div>
          </div>
          <Table
            sortColumn={tableState.sortColumn}
            onSortChange={setTableState}
            print={<PrintTable sickLeaves={sickLeaves} showPersonalInformation={showPersonalInformation} />}
            ascending={tableState.ascending}
          >
            <thead>
              <TableHeaderRow showPersonalInformation={showPersonalInformation} isDoctor={isDoctor} />
            </thead>
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
