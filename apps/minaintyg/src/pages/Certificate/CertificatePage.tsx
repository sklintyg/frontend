import { IDSCard, IDSSpinner } from '@frontend/ids-react-ts'
import { skipToken } from '@reduxjs/toolkit/query'
import { useParams } from 'react-router-dom'
import { DisplayHTML } from '../../components/DisplayHTML/DisplayHTML'
import { PageDivider } from '../../components/PageDivider/PageDivider'
import { PageHeading } from '../../components/PageHeading/PageHeading'
import { PageHeadingDescription } from '../../components/PageHeading/PageHeadingDescription'
import { useGetCertificateQuery } from '../../store/api'
import { CertificateActions } from './components/CertificateActions'
import { CertificateBody } from './components/CertificateBody/CertificateBody'
import { CertificateEventsInfo } from './components/CertificateEventsInfo/CertificateEventsInfo'
import { CertificateFooter } from './components/CertificateFooter'
import { CertificateInformation } from './components/CertificateInformation'
import { CertificateReplacedAlert } from './components/CertificateReplacedAlert'
import { CertificateStatusBadge } from './components/CertificateStatusBadge'

export function CertificatePage() {
  const { id } = useParams()
  const { data: certificate, isLoading } = useGetCertificateQuery(id ? { id } : skipToken)

  if (isLoading) {
    return <IDSSpinner data-testid="spinner" />
  }

  if (!certificate) {
    return null
  }

  return (
    <>
      <PageHeading heading="Läs och hantera ditt intyg">
        {certificate.metadata.statuses.includes('REPLACED') && <CertificateReplacedAlert />}
        {certificate.metadata.type.description && (
          <PageHeadingDescription>
            <DisplayHTML html={certificate.metadata.type.description} />
          </PageHeadingDescription>
        )}
      </PageHeading>

      <div className="mb-5">
        <CertificateActions recipient={certificate.metadata.recipient} />
      </div>

      <IDSCard>
        <div className="mb-5 flex flex-col justify-between gap-2.5 md:flex-row md:gap-5">
          <h2 className="ids-heading-2 mb-0">{certificate.metadata.type.name}</h2>
          <div className="flex gap-1">
            {certificate.metadata.statuses.map((status) => (
              <CertificateStatusBadge key={status} status={status} />
            ))}
          </div>
        </div>
        <div className="mb-5">
          <CertificateInformation {...certificate.metadata} />
        </div>
        <CertificateEventsInfo events={certificate.metadata.events} />
        <PageDivider />
        <article className="ids-certificate">
          <CertificateBody content={certificate.content} />
          <CertificateFooter {...certificate.metadata} />
        </article>
      </IDSCard>
    </>
  )
}
