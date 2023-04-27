import { useEffect } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { Table } from '../../components/Table/Table'
import { UserUrval } from '../../schemas'
import { useGetUserQuery, useLazyGetSickLeavesQuery } from '../../store/api'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { SjukfallColumn } from '../../store/slices/sjukfallTableColumnsSlice'
import { Filters } from './components/Filters'
import { ModifySicknessTableColumns } from './components/ModifySicknessTableColumns'
import { TableBodyRows } from './components/TableBodyRows'
import { TableHeaderRow } from './components/TableHeaderRow'
import { TableInfo } from './components/TableInfo'
import { reset, resetFilters, updateShowPersonalInformation } from './sickLeaveSlice'

export function CurrentSickLeaves() {
  const { isLoading: userLoading, data: user } = useGetUserQuery()
  const [triggerGetSickLeaves, { isLoading: currentSickLeaveLoading, data: sickLeaves }] = useLazyGetSickLeavesQuery()
  const { showPersonalInformation } = useAppSelector((state) => state.sickLeave)
  const { patientId } = useParams()
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

  if (patientId) {
    return <Outlet />
  }

  return (
    <div className="ids-content m-auto max-w-7xl py-10 px-2.5">
      <h1 className="ids-heading-2">Pågående sjukfall</h1>
      <h2 className="ids-heading-3 mb-10">{user && user.valdVardenhet ? user.valdVardenhet.namn : ''}</h2>
      <hr className="opacity-40" />

      <Filters
        onSearch={(request) => triggerGetSickLeaves(request)}
        onReset={() => {
          dispatch(resetFilters())
        }}
        isDoctor={isDoctor}
      />

      <div className="flex">
        <div className="w-full">
          <TableInfo
            onShowPersonalInformationChange={(checked) => {
              dispatch(updateShowPersonalInformation(checked))
            }}
            showPersonalInformation={showPersonalInformation}
            totalNumber={(sickLeaves ?? []).length}
            listLength={(sickLeaves ?? []).length}
            daysAfterSickLeaveEnd={user?.preferences?.maxAntalDagarSedanSjukfallAvslut ?? ''}
            daysBetweenCertificates={user?.preferences?.maxAntalDagarMellanIntyg ?? ''}
          />
        </div>

        <div className="mb-5 w-96 self-end">
          <ModifySicknessTableColumns />
        </div>
      </div>

      <Table sortColumn={SjukfallColumn.Startdatum}>
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
