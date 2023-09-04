import { IDSButton, IDSIconChevron } from '@frontend/ids-react-ts'
import { useRef } from 'react'
import { useGetCertificatesFilterQuery } from '../../../../store/api'
import { useAppDispatch } from '../../../../store/hooks'
import { reset } from '../../../../store/slice/certificateFilter.slice'
import { CertificateStatusFilter } from './CertificateStatusFilter'
import { CertificateTypeFilter } from './CertificateTypeFilter'
import { CertificateUnitFilter } from './CertificateUnitFilter'
import { CertificateYearFilter } from './CertificateYearFilter'

export function CertificateListFilter({ onSubmit }: { onSubmit: () => void }) {
  const { data: filter } = useGetCertificatesFilterQuery()
  const dispatch = useAppDispatch()
  const ref = useRef<HTMLFormElement>(null)

  return (
    <details open className="group mb-5">
      <summary className="flex flex-col md:flex-row">
        <div className="border-stone-clear grow border-y py-2.5 md:pl-5">{filter?.total ?? 0} intyg</div>
        <div className="border-stone-clear -mt-px flex justify-between gap-5 border-y py-2.5 md:border-l md:px-5">
          Filtrera lista
          <IDSIconChevron width="100%" height="100%" className="h-2.5 w-2.5 rotate-90 self-center group-open:-rotate-90" />
        </div>
      </summary>
      <form ref={ref} className="border-stone-clear grid grid-cols-1 gap-5 border-b py-5 md:grid-cols-4 md:gap-10">
        <CertificateStatusFilter options={filter?.statuses ?? []} />
        <CertificateUnitFilter options={filter?.units ?? []} />
        <CertificateTypeFilter options={filter?.certificateTypes ?? []} />
        <CertificateYearFilter options={filter?.years ?? []} />
        <div className="flex flex-col gap-5 md:col-span-4 md:flex-row">
          <IDSButton secondary sblock onClick={() => dispatch(reset())}>
            Återställ filter
          </IDSButton>
          <IDSButton sblock onClick={onSubmit}>
            Filtrera
          </IDSButton>
        </div>
      </form>
    </details>
  )
}
