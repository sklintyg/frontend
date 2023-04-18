import { IDSContainer } from '@frontend/ids-react-ts'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { Table } from '../../components/Table/Table'
import { SickLeaveColumn } from '../../schemas/sickLeaveSchema'
import { useGetSickLeavesMutation, useGetUserQuery } from '../../store/api'
import { RootState, useAppDispatch } from '../../store/store'
import { Filters } from './components/Filters'
import { TableBodyRows } from './components/TableBodyRows'
import { TableHeaderRow } from './components/TableHeaderRow'
import { TableInfo } from './components/TableInfo'
import { reset, resetFilters, updateShowPersonalInformation } from './sickLeaveSlice'

export function CurrentSickLeaves() {
  const { isLoading: userLoading, data: user } = useGetUserQuery()
  const { showPersonalInformation } = useSelector((state: RootState) => state.sickLeave)
  const [triggerGetSickLeaves, { isLoading: currentSickLeaveLoading, data: sickLeaves }] = useGetSickLeavesMutation()
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
        totalNumber={(sickLeaves ?? []).length}
        listLength={(sickLeaves ?? []).length}
        daysAfterSickLeaveEnd={user?.preferences?.maxAntalDagarMellanIntyg ?? ''}
        daysBetweenCertificates={user?.preferences?.maxAntalDagarSedanSjukfallAvslut ?? ''}
      />

      <IDSContainer gutterless className="overflow-y-auto">
        <Table column={SickLeaveColumn.Startdatum}>
          <thead>
            <TableHeaderRow showPersonalInformation={showPersonalInformation} />
          </thead>
          <tbody style={{ overflowWrap: 'anywhere' }}>
            <TableBodyRows
              isDoctor={isDoctor}
              isLoading={isLoading}
              showPersonalInformation={showPersonalInformation}
              sickLeaves={sickLeaves}
              unitId={user && user.valdVardenhet ? user.valdVardenhet.namn : ''}
            />
          </tbody>
        </Table>
      </IDSContainer>
    </div>
  )
}
