import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { useGetUserQuery, useLazyGetSickLeavesQuery } from '../../store/api'
import { Table } from '../../components/Table/Table'
import { SickLeaveColumn } from '../../schemas/sickLeaveSchema'
import { RootState, useAppDispatch } from '../../store/store'
import { Filters } from './components/Filters'
import { TableBodyRows } from './components/TableBodyRows'
import { TableHeaderRow } from './components/TableHeaderRow'
import { TableInfo } from './components/TableInfo'
import { reset, resetFilters, updateShowPersonalInformation } from './sickLeaveSlice'
import { UserUrval } from '../../schemas'

export function CurrentSickLeaves() {
  const { isLoading: userLoading, data: user } = useGetUserQuery()
  const [triggerGetSickLeaves, { isLoading: currentSickLeaveLoading, data: sickLeaves }] = useLazyGetSickLeavesQuery()
  const { showPersonalInformation } = useSelector((state: RootState) => state.sickLeave)
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

      <Table column={SickLeaveColumn.Startdatum}>
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
