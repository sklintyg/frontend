import { IDSButton } from '@frontend/ids-react-ts'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { Table } from '../../components/Table/Table'
import { ErrorAlert } from '../../components/error/ErrorAlert/ErrorAlert'
import { UserUrval } from '../../schemas'
import { useGetPopulatedFiltersQuery, useGetUserQuery, useLazyGetSickLeavesQuery } from '../../store/api'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { reset, resetFilters } from '../../store/slices/sickLeave.slice'
import { SickLeaveColumn } from '../../store/slices/sickLeaveTableColumns.slice'
import { CurrentSickLeavesHeading } from './components/CurrentSickLeavesHeading'
import { Filters } from './components/Filters'
import { ModifySicknessTableColumns } from './components/ModifySicknessTableColumns'
import { PrintTable } from './components/PrintTable'
import { TableBodyRows } from './components/TableBodyRows'
import { TableHeaderRow } from './components/TableHeaderRow'
import { CurrentSickLeavesTableInfo } from './components/CurrentSickLeavesTableInfo'
import { updateShowPersonalInformation } from '../../store/slices/settings.slice'
import { UnansweredCommunicationError } from '../../components/error/UnansweredCommunicationError/UnansweredCommunicationError'

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
      <CurrentSickLeavesHeading user={user} />
      <h3 className="ids-heading-4 hidden print:block">Valda filter</h3>
      <Filters
        onSearch={(request) => triggerGetSickLeaves(request)}
        onReset={() => {
          dispatch(resetFilters())
        }}
        isDoctor={isDoctor}
      />
      {error && (
        <ErrorAlert
          heading="Sjukfall för enheten kunde inte hämtas."
          errorType="error"
          text="Sjukfall för enheten kan inte visas på grund av ett tekniskt fel. Försök igen om en stund. Om felet kvarstår, kontakta i första hand din lokala IT-support och i andra hand"
          dynamicLink
        />
      )}
      {!error && (
        <div>
          <div className="pb-10">{currentSickLeavesInfo?.unansweredCommunicationError && <UnansweredCommunicationError />}</div>
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
                unitId={user && user.valdVardenhet ? user.valdVardenhet.namn : ''}
              />
            </tbody>
          </Table>
        </div>
      )}
    </div>
  )
}
