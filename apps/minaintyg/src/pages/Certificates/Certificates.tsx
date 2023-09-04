import { IDSLink } from '@frontend/ids-react-ts'
import { useState } from 'react'
import { PageHeading } from '../../components/PageHeading/PageHeading'
import { useGetCertificateQuery } from '../../store/api'
import { CertificateList } from './components/CertificateList'
import { CertificateListOrder, SortingOrder } from './components/CertificateListOrder'

export function Certificates() {
  const [order, setOrder] = useState<SortingOrder>('descending')
  const { data } = useGetCertificateQuery()

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
      <CertificateListOrder setOrder={setOrder} order={order} />
      {data && <CertificateList certificates={data.content} order={order} />}
    </>
  )
}
