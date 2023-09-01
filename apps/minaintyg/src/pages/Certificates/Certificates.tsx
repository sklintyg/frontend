import { IDSLink } from '@frontend/ids-react-ts'
import { PageHeading } from '../../components/PageHeading/PageHeading'
import { useGetCertificateQuery } from '../../store/api'
import { CertificateList } from './components/CertificateList'

export function Certificates() {
  const { data } = useGetCertificateQuery()

  return (
    <>
      <PageHeading heading="Intyg">
        Här listas dina läkarintyg som vården utfärdat digitalt. Du kan skicka intyg digitalt till Försäkringskassan och Transportstyrelsen.
        Läkarintyg om arbetsförmåga kan inte skickas digitalt till din arbetsgivare, däremot kan du skriva ut intyget. Saknar du ett intyg
        ska du kontakta vården. Du hittar mer information i{' '}
        <IDSLink>
          <a href="/om-intyg">Om Intyg</a>
        </IDSLink>
        .
      </PageHeading>
      {data && <CertificateList certificates={data.content} />}
    </>
  )
}
