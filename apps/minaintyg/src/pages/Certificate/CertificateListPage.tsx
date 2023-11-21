import { IDSSpinner } from '@frontend/ids-react-ts'
import { useSessionStorage } from '@react-hooks-library/core'
import { SortDirection } from 'react-stately'
import { PageHeading } from '../../components/PageHeading/PageHeading'
import { PageHeadingDescription } from '../../components/PageHeading/PageHeadingDescription'
import { SupportLink } from '../../components/error/SupportLink/SupportLink'
import { TechnicalIssueAlert } from '../../components/error/TechnicalIssueAlert'
import { useGetCertificatesFilterQuery, useGetCertificatesQuery } from '../../store/api'
import { useAppSelector } from '../../store/hooks'
import { CertificateList } from './components/CertificateList'
import { CertificateListFilter } from './components/CertificateListFilter/CertificateListFilter'
import { CertificateListOrder } from './components/CertificateListOrder/CertificateListOrder'
import { EmptyCertificateListInfo } from './components/EmptyCertificateListInfo'
import {ReadMoreAboutAction} from "./components/ReadMoreAboutDialog/ReadMoreAboutAction";

export function CertificateListPage() {
  const [order, setOrder] = useSessionStorage<SortDirection>('certificate-list-order', 'descending')
  const { submitFilters } = useAppSelector((state) => state.certificateFilter)
  const { isLoading: isLoadingList, data: list, error } = useGetCertificatesQuery(submitFilters)
  const { isLoading: isLoadingFilters, data: filter } = useGetCertificatesFilterQuery()
  const isLoading = isLoadingList || isLoadingFilters

  return (
    <>
      <PageHeading heading="Intyg">
        <PageHeadingDescription>
          Här hittar du dina digitala intyg som vården skrivit. I Intyg kan du läsa, skicka och skriva ut dina intyg. Saknar du ett intyg,
          eller vill begära ett intyg? Vänd dig till din mottagning. Klicka på länken “Läs mer” nedan om du vill veta vad du kan göra i
          Intyg.
        </PageHeadingDescription>
        <ReadMoreAboutAction />
      </PageHeading>
      <CertificateListFilter listed={list?.content.length ?? 0} />
      <CertificateListOrder setOrder={setOrder} order={order} />
      {isLoading && <IDSSpinner data-testid="certificate-list-spinner" />}
      {error && (
        <TechnicalIssueAlert error={error}>
          <p>
            Intygen kunde inte visas på grund av ett tekniskt fel. Försök igen senare. Om felet kvarstår kontakta <SupportLink />.
          </p>
          <p>Om du inte kan nå ditt intyg, kontakta din läkare för att få en kopia av intyget.</p>
        </TechnicalIssueAlert>
      )}
      {list && list.content.length === 0 && <EmptyCertificateListInfo total={filter?.total ?? 0} />}
      {list && <CertificateList certificates={list.content} order={order} />}
    </>
  )
}
