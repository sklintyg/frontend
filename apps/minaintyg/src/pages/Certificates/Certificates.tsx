import { IDSLink } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { PageHeading } from '../../components/PageHeading/PageHeading'
import { CertificateSelectedOptions } from '../../schema/certificateListFilter.schema'
import { useGetCertificatesQuery } from '../../store/api'
import { useAppSelector } from '../../store/hooks'
import { CertificateList } from './components/CertificateList'
import { CertificateListFilter } from './components/CertificateListFilter/CertificateListFilter'
import { CertificateListOrder, SortingOrder } from './components/CertificateListOrder'

export function Certificates() {
  const [order, setOrder] = useState<SortingOrder>('descending')
  const filters = useAppSelector((state) => state.certificateFilter)
  const [submitFilters, setSubmitFilters] = useState<Partial<CertificateSelectedOptions>>({})
  const { data } = useGetCertificatesQuery(submitFilters)

  return (
    <>
      <PageHeading heading="Intyg">
        Här listas dina läkarintyg som vården utfärdat digitalt. Du kan skicka intyg digitalt till Försäkringskassan och Transportstyrelsen.
        Läkarintyg om arbetsförmåga kan inte skickas digitalt till din arbetsgivare, däremot kan du skriva ut intyget. Saknar du ett intyg
        ska du kontakta vården. Du hittar mer information i{' '}
        <IDSLink underlined>
          <a href="/om-intyg">Om Intyg</a>
        </IDSLink>
        .
      </PageHeading>
      <CertificateListFilter onSubmit={() => setSubmitFilters(filters)} />
      <CertificateListOrder setOrder={setOrder} order={order} />
      {data && <CertificateList certificates={data.content} order={order} />}
    </>
  )
}
