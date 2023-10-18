import { TableFilter } from '../../../components/Table/TableFilter'
import { LUCertificatesFilter } from '../../../schemas/luCertificatesSchema'
import { useGetUserQuery } from '../../../store/api'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { useGetLUFiltersQuery } from '../../../store/luApi'
import { displayErrors, reset } from '../../../store/slices/luCertificatesFilter.slice'
import { isUserDoctor } from '../../../utils/isUserDoctor'
import { LUCertificateAgeFilter } from './LUCertificatesFilters/LUCertificateAgeFilter'
import { LUCertificateDiagnosisFilter } from './LUCertificatesFilters/LUCertificateDiagnosisFilter'
import { LUCertificateDoctorFilter } from './LUCertificatesFilters/LUCertificateDoctorFilter'
import { LUCertificateSearchFilter } from './LUCertificatesFilters/LUCertificateSearchFilter'
import { LUCertificateTypeFilter } from './LUCertificatesFilters/LUCertificateTypeFilter'
import { LUCertificatesDateRangeFilter } from './LUCertificatesFilters/LUCertificatesDateRangeFilter'
import { LUCertificateQAFilter } from './LUCertificatesFilters/LUCertificatesQAFilter'

export function LUCertificatesFilters({ onSearch }: { onSearch: (filter: LUCertificatesFilter) => void }) {
  const { filter, isValidDateRange } = useAppSelector((state) => state.luCertificatesFilter)
  const { data: populatedFilters } = useGetLUFiltersQuery()
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
      <LUCertificateDiagnosisFilter options={populatedFilters.allDiagnosisChapters} />
      {!isUserDoctor(user) && <LUCertificateDoctorFilter options={populatedFilters.doctors} />}
      <LUCertificateQAFilter />
      <LUCertificateSearchFilter />
      <LUCertificateTypeFilter />
      <LUCertificateAgeFilter />
      <LUCertificatesDateRangeFilter />
    </TableFilter>
  )
}
