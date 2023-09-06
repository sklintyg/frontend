import { useState } from 'react'
import { SortDirection } from 'react-stately'
import { PageHeading } from '../../components/PageHeading/PageHeading'
import { useGetCertificateQuery } from '../../store/api'
import { CertificateList } from './components/CertificateList'
import { CertificateListOrder } from './components/CertificateListOrder'

export function Certificates() {
  const [order, setOrder] = useState<SortDirection>('descending')
  const { data } = useGetCertificateQuery()

  return (
    <>
      <PageHeading heading="Intyg">
        Här listas dina läkarintyg som vården utfärdat digitalt. Hittar du inte ditt intyg, vänd dig till din mottagning. Du kan skicka
        intyg digitalt till Försäkringskassan och Transportstyrelsen. Läkarintyg om arbetsförmåga kan inte skickas digitalt till din
        arbetsgivare.
      </PageHeading>
      <CertificateListOrder setOrder={setOrder} order={order} />
      {data && <CertificateList certificates={data.content} order={order} />}
    </>
  )
}
