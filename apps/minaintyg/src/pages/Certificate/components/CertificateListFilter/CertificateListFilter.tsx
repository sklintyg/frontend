import { IDSButton } from 'ids-react-ts'
import { omit } from 'utils'
import { FilterAccordion } from '../../../../components/FilterAccordion/FilterAccordion'
import { useGetCertificatesFilterQuery } from '../../../../store/api'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { reset, submit } from '../../../../store/slice/certificateFilter.slice'
import { CertificateStatusFilter } from './CertificateStatusFilter'
import { CertificateTypeFilter } from './CertificateTypeFilter'
import { CertificateUnitFilter } from './CertificateUnitFilter'
import { CertificateYearFilter } from './CertificateYearFilter'

export function CertificateListFilter({ listed }: { listed: number }) {
  const { data: filterOptions } = useGetCertificatesFilterQuery()
  const { ...filter } = useAppSelector((state) => state.certificateFilter)
  const dispatch = useAppDispatch()

  if (!filterOptions) {
    return null
  }

  return (
    <FilterAccordion listed={listed} total={filterOptions.total} noun="intyg">
      <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-x-10">
        <CertificateStatusFilter options={filterOptions.statuses} />
        <CertificateUnitFilter options={filterOptions.units} />
        <CertificateTypeFilter options={filterOptions.certificateTypes} />
        <CertificateYearFilter options={filterOptions.years} />
      </div>
      <div className="flex flex-col justify-end gap-5 md:flex-row">
        <IDSButton secondary mblock onClick={() => dispatch(reset())} aria-label="Rensa filter">
          Rensa filter
        </IDSButton>
        <IDSButton
          mblock
          onClick={() => {
            dispatch(submit(omit(filter, ['submitFilters'])))
          }}
          aria-label="Filtrera"
        >
          Filtrera
        </IDSButton>
      </div>
    </FilterAccordion>
  )
}
