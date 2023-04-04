import { useSelector } from 'react-redux'
import { useGetUserQuery } from '../../store/api'
import { resetFilters, updateFilter, updateShowPersonalInformation } from '../../store/sickLeaveSlice'
import { RootState, useAppDispatch } from '../../store/store'
import { Filters } from './components/Filters'
import { Table } from './components/Table'
import { TableInfo } from './components/TableInfo'

export function CurrentSickLeavesTable() {
  const { data: user } = useGetUserQuery()
  const { showPersonalInformation, filter } = useSelector((state: RootState) => state.sickLeave)
  const dispatch = useAppDispatch()
  const isDoctor = !!user && !!user.roles.LAKARE

  return (
    <div className="ids-content py-10">
      <h1 className="ids-heading-2">Pågående sjukfall</h1>
      <h2 className="ids-heading-3 mb-10">{user && user.valdVardenhet ? user.valdVardenhet.namn : ''}</h2>
      <hr className="opacity-40" />

      <Filters
        onSearch={() => updateFilter('filter?')}
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
        daysAfterSickLeaveEnd={user?.preferences?.maxAntalDagarMellanIntyg ?? ''}
        daysBetweenCertificates={user?.preferences?.maxAntalDagarSedanSjukfallAvslut ?? ''}
      />

      {filter && <Table />}
    </div>
  )
}
