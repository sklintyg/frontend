import { IDSButton } from '@frontend/ids-react-ts'
import { FilterAccordion } from '../../../../components/FilterAccordion/FilterAccordion'
import { useGetCertificatesFilterQuery } from '../../../../store/api'
import { useAppDispatch } from '../../../../store/hooks'
import { reset } from '../../../../store/slice/certificateFilter.slice'
import { CertificateStatusFilter } from './CertificateStatusFilter'
import { CertificateTypeFilter } from './CertificateTypeFilter'
import { CertificateUnitFilter } from './CertificateUnitFilter'
import { CertificateYearFilter } from './CertificateYearFilter'

export function CertificateListFilter({ listed, onSubmit }: { listed: number; onSubmit: () => void }) {
  const { data: filter } = useGetCertificatesFilterQuery()
  const dispatch = useAppDispatch()

  if (!filter) {
    return null
  }

  return (
    <FilterAccordion listed={listed} total={filter.total ?? 0} noun="intyg">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4 md:gap-10">
        <CertificateStatusFilter options={filter.statuses} />
        <CertificateUnitFilter options={filter.units} />
        <CertificateTypeFilter options={filter.certificateTypes} />
        <CertificateYearFilter options={filter.years} />
        <div className="flex flex-col gap-5 md:col-span-4 md:flex-row">
          <IDSButton secondary sblock onClick={() => dispatch(reset())} aria-label="Återställ filter">
            Återställ filter
          </IDSButton>
          <IDSButton sblock onClick={onSubmit} aria-label="Filtrera">
            Filtrera
          </IDSButton>
        </div>
      </div>
    </FilterAccordion>
  )
}
