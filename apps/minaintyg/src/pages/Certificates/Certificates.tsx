import { IDSSpinner } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { SortDirection } from 'react-stately'
import { PageHeading } from '../../components/PageHeading/PageHeading'
import { CertificateSelectedOptions } from '../../schema/certificateListFilter.schema'
import { useGetCertificatesQuery } from '../../store/api'
import { useAppSelector } from '../../store/hooks'
import { CertificateList } from './components/CertificateList'
import { CertificateListFilter } from './components/CertificateListFilter/CertificateListFilter'
import { CertificateListOrder } from './components/CertificateListOrder/CertificateListOrder'
import { EmptyCertificateListInfo } from './components/EmptyCertificateListInfo'

export function Certificates() {
  const [order, setOrder] = useState<SortDirection>('descending')
  const [submitFilters, setSubmitFilters] = useState<Partial<CertificateSelectedOptions>>({})
  const { isLoading, data } = useGetCertificatesQuery(submitFilters, { refetchOnMountOrArgChange: true })
  const filters = useAppSelector((state) => state.certificateFilter)

  return (
    <>
      <PageHeading heading="Intyg">
        Här listas dina läkarintyg som vården utfärdat digitalt. Hittar du inte ditt intyg, vänd dig till din mottagning. Du kan skicka
        intyg digitalt till Försäkringskassan och Transportstyrelsen. Läkarintyg om arbetsförmåga kan inte skickas digitalt till din
        arbetsgivare.
      </PageHeading>
      <CertificateListFilter listed={data?.content.length ?? 0} onSubmit={() => setSubmitFilters(filters)} />
      <CertificateListOrder setOrder={setOrder} order={order} />
      {isLoading && (
        <div data-testid="certificate-list-spinner">
          <IDSSpinner />
        </div>
      )}
      {data && data.content.length === 0 && <EmptyCertificateListInfo />}
      {data && <CertificateList certificates={data.content} order={order} />}
    </>
  )
}
