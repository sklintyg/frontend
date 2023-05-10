import { IDSButton } from '@frontend/ids-react-ts'
import { useEffect } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { Table } from '../../components/Table/Table'
import { UserUrval } from '../../schemas'
import { useGetPopulatedFiltersQuery, useGetUserQuery, useLazyGetSickLeavesQuery } from '../../store/api'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { reset, resetFilters, updateShowPersonalInformation } from '../../store/slices/sickLeave.slice'
import { SickLeaveColumn } from '../../store/slices/sickLeaveTableColumns.slice'
import { CurrentSickLeavesHeading } from './components/CurrentSickLeavesHeading'
import { Filters } from './components/Filters'
import { ModifySicknessTableColumns } from './components/ModifySicknessTableColumns'
import { PrintFilters } from './components/PrintFilters'
import { PrintTable } from './components/PrintTable'
import { TableBodyRows } from './components/TableBodyRows'
import { TableHeaderRow } from './components/TableHeaderRow'
import { TableInfo } from './components/TableInfo'

export function CurrentSickLeaves() {
  const { isLoading: userLoading, data: user } = useGetUserQuery()
  const { data: populatedFilters } = useGetPopulatedFiltersQuery()
  const [triggerGetSickLeaves, { isLoading: currentSickLeaveLoading, data: sickLeaves }] = useLazyGetSickLeavesQuery()
  const { showPersonalInformation } = useAppSelector((state) => state.sickLeave)
  const { encryptedPatientId } = useParams()
  const dispatch = useAppDispatch()
  const isLoading = userLoading || currentSickLeaveLoading
  const isDoctor = user?.urval === UserUrval.ISSUED_BY_ME
  const navigate = useNavigate()

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

      <div className="print:hidden">
        <Filters
          onSearch={(request) => triggerGetSickLeaves(request)}
          onReset={() => {
            dispatch(resetFilters())
          }}
          isDoctor={isDoctor}
        />
      </div>
      <PrintFilters isDoctor={isDoctor} />

      <div className="flex">
        <div className="w-full">
          <TableInfo
            onShowPersonalInformationChange={(checked) => {
              dispatch(updateShowPersonalInformation(checked))
            }}
            showPersonalInformation={showPersonalInformation}
            totalNumber={populatedFilters && populatedFilters.nbrOfSickLeaves ? populatedFilters.nbrOfSickLeaves : 0}
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
        sortColumn={SickLeaveColumn.Startdatum}
        print={<PrintTable sickLeaves={sickLeaves} showPersonalInformation={showPersonalInformation} />}
        ascending>
        <thead>
          <TableHeaderRow showPersonalInformation={showPersonalInformation} />
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
  )
}
