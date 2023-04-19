import { IDSContainer } from '@frontend/ids-react-ts'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { useGetUserQuery, useLazyGetSickLeavesQuery } from '../../store/api'
import { RootState, useAppDispatch } from '../../store/store'
import { Filters } from './components/Filters'
import { TableBodyRows } from './components/TableBodyRows'
import { TableHeaderRow } from './components/TableHeaderRow'
import { TableInfo } from './components/TableInfo'
import { reset, resetFilters, sortOnColumn, toggleAscending, updateShowPersonalInformation } from './sickLeaveSlice'
import { getSortedSickLeaves } from './utils/getSortedSickLeaves'

export function CurrentSickLeaves() {
  const { isLoading: userLoading, data: user } = useGetUserQuery()
  const { showPersonalInformation, ascending, currentColumn } = useSelector((state: RootState) => state.sickLeave)
  const [triggerGetSickLeaves, { isLoading: currentSickLeaveLoading, data: currentSickLeaves }] = useLazyGetSickLeavesQuery()
  const { patientId } = useParams()
  const dispatch = useAppDispatch()
  const isLoading = userLoading || currentSickLeaveLoading
  const isDoctor = !!user && !!user.roles.LAKARE
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
    <IDSContainer>
      <div className="ids-content py-10">
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
          totalNumber={(currentSickLeaves ?? []).length}
          listLength={(currentSickLeaves ?? []).length}
          daysAfterSickLeaveEnd={user?.preferences?.maxAntalDagarMellanIntyg ?? ''}
          daysBetweenCertificates={user?.preferences?.maxAntalDagarSedanSjukfallAvslut ?? ''}
        />
        <IDSContainer gutterless className="overflow-y-auto">
          <table className="ids-table w-full rounded-md text-sm">
            <thead>
              <TableHeaderRow
                ascending={ascending}
                currentColumn={currentColumn}
                showPersonalInformation={showPersonalInformation}
                onColumnSort={(column) => {
                  if (currentColumn !== column) {
                    dispatch(sortOnColumn(column))
                  } else {
                    dispatch(toggleAscending())
                  }
                }}
              />
            </thead>
            <tbody style={{ overflowWrap: 'anywhere' }}>
              <TableBodyRows
                isDoctor={isDoctor}
                isLoading={isLoading}
                showPersonalInformation={showPersonalInformation}
                sickLeaves={currentSickLeaves ? getSortedSickLeaves(currentSickLeaves, ascending, currentColumn) : undefined}
                unitId={user && user.valdVardenhet ? user.valdVardenhet.namn : ''}
              />
            </tbody>
          </table>
        </IDSContainer>
      </div>
    </IDSContainer>
  )
}
