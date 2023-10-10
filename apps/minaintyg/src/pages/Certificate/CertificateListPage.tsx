import { IDSSpinner } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { SortDirection } from 'react-stately'
import { PageHeading } from '../../components/PageHeading/PageHeading'
import { useGetCertificatesFilterQuery, useGetCertificatesQuery } from '../../store/api'
import { useAppSelector } from '../../store/hooks'
import { CertificateFilterState } from '../../store/slice/certificateFilter.slice'
import { CertificateList } from './components/CertificateList'
import { CertificateListFilter } from './components/CertificateListFilter/CertificateListFilter'
import { CertificateListOrder } from './components/CertificateListOrder/CertificateListOrder'
import { EmptyCertificateListInfo } from './components/EmptyCertificateListInfo'

export function CertificateListPage() {
  const [order, setOrder] = useState<SortDirection>('descending')
  const [submitFilters, setSubmitFilters] = useState<CertificateFilterState>({})
  const { isLoading: isLoadingList, data: list } = useGetCertificatesQuery(submitFilters, { refetchOnMountOrArgChange: true })
  const { isLoading: isLoadingFilters, data: filter } = useGetCertificatesFilterQuery()
  const filters = useAppSelector((state) => state.certificateFilter)
  const isLoading = isLoadingList || isLoadingFilters

  return (
    <>
      <PageHeading heading="Intyg">
        Här listas dina läkarintyg som vården utfärdat digitalt. Hittar du inte ditt intyg, vänd dig till din mottagning. Du kan skicka
        intyg digitalt till Försäkringskassan och Transportstyrelsen. Läkarintyg om arbetsförmåga kan inte skickas digitalt till din
        arbetsgivare.
      </PageHeading>
      <CertificateListFilter listed={list?.content.length ?? 0} onSubmit={() => setSubmitFilters(filters)} />
      <CertificateListOrder setOrder={setOrder} order={order} />
      {isLoading && (
        <div data-testid="certificate-list-spinner">
          <IDSSpinner />
        </div>
      )}
      {list && list.content.length === 0 && <EmptyCertificateListInfo total={filter?.total ?? 0} />}
      {list && <CertificateList certificates={list.content} order={order} />}
    </>
  )
}
