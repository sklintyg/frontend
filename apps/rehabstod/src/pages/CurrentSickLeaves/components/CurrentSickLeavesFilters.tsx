import { CurrentSickLeavesAgeFilter } from './CurrentSickLeavesFilter/CurrentSickLeavesAgeFilter'
import { CurrentSickLeavesDateRangeFilter } from './CurrentSickLeavesFilter/CurrentSickLeavesDateRangeFilter'
import { CurrentSickLeavesDiagnosisFilter } from './CurrentSickLeavesFilter/CurrentSickLeavesDiagnosisFilter'
import { CurrentSickLeavesDoctorFilter } from './CurrentSickLeavesFilter/CurrentSickLeavesDoctorFilter'
import { CurrentSickLeavesOccupationFilter } from './CurrentSickLeavesFilter/CurrentSickLeavesOccupationFilter'
import { CurrentSickLeavesQAFilter } from './CurrentSickLeavesFilter/CurrentSickLeavesQAFilter'
import { CurrentSickLeavesSearchFilter } from './CurrentSickLeavesFilter/CurrentSickLeavesSearchFilter'
import { CurrentSickLeavesStatusFilter } from './CurrentSickLeavesFilter/CurrentSickLeavesStatusFilter'
import { CurrentSickLeavesTimePeriodFilter } from './CurrentSickLeavesFilter/CurrentSickLeavesTimePeriodFilter'
import { PrintTitle } from '../../../components/Table/print/PrintTitle'
import { TableFilter } from '../../../components/Table/TableFilter'
import { SickLeaveFilter } from '../../../schemas/sickLeaveSchema'
import { useGetUserQuery } from '../../../store/api'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { useGetSickLeavesFiltersQuery } from '../../../store/sickLeaveApi'
import { displayErrors, reset } from '../../../store/slices/sickLeaveFilter.slice'
import { isUserDoctor } from '../../../utils/isUserDoctor'

export function CurrentSickLeavesFilters({ onSearch }: { onSearch: (filter: SickLeaveFilter) => void }) {
  const { data: populatedFilters } = useGetSickLeavesFiltersQuery()
  const { filter, isValidDateRange } = useAppSelector((state) => state.sickLeaveFilter)
  const showPersonalInformation = useAppSelector((state) => state.settings.showPersonalInformation)
  const { data: user } = useGetUserQuery()
  const dispatch = useAppDispatch()

  if (!user || !populatedFilters) {
    return null
  }

  return (
    <TableFilter
      onSearch={() => {
        if (isValidDateRange) {
          dispatch(displayErrors(false))
          onSearch(filter)
        } else {
          dispatch(displayErrors(true))
        }
      }}
      onReset={() => dispatch(reset())}
    >
      <div className="hidden print:block">
        <PrintTitle title="Personuppgifter" />
        {showPersonalInformation ? 'Visas' : 'Visas ej'}
      </div>
      <CurrentSickLeavesDiagnosisFilter />
      {!isUserDoctor(user) && <CurrentSickLeavesDoctorFilter options={populatedFilters.activeDoctors} />}
      <CurrentSickLeavesSearchFilter />
      <CurrentSickLeavesAgeFilter />
      <CurrentSickLeavesTimePeriodFilter />
      <CurrentSickLeavesStatusFilter options={populatedFilters.rekoStatusTypes} />
      <CurrentSickLeavesQAFilter options={populatedFilters.unansweredCommunicationFilterTypes} />
      <CurrentSickLeavesOccupationFilter options={populatedFilters.occupationTypes} />
      <CurrentSickLeavesDateRangeFilter />
    </TableFilter>
  )
}
