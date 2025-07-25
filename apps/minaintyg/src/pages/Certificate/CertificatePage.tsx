import { Heading } from '@frontend/components'
import { IDSAlert, IDSCard, IDSSpinner } from '@inera/ids-react'
import { skipToken } from '@reduxjs/toolkit/query'
import { ScrollRestoration, useParams } from 'react-router-dom'
import { PageDivider } from '../../components/PageDivider/PageDivider'
import { PageHeading } from '../../components/PageHeading/PageHeading'
import { PageHeadingDescription } from '../../components/PageHeading/PageHeadingDescription'
import { useGetCertificateQuery } from '../../store/api'
import { CertificateActions } from './components/CertificateActions/CertificateActions'
import { CertificateAttentionAlert } from './components/CertificateAttentionAlert/CertificateAttentionAlert'
import { CertificateBody } from './components/CertificateBody/CertificateBody'
import { CertificateEventsInfo } from './components/CertificateEventsInfo/CertificateEventsInfo'
import { CertificateFooter } from './components/CertificateFooter'
import { CertificateInformation } from './components/CertificateInformation'
import { CertificatePreambleText } from './components/CertificatePremableText/CertificatePreambleText'
import { CertificateReplacedAlert } from './components/CertificateReplacedAlert'
import { CertificateStatusBadge } from './components/CertificateStatusBadge'
import { ReadCertificateError } from './components/ReadCertificateError'
import { ReadMoreAboutAction } from './components/ReadMoreAboutDialog/ReadMoreAboutAction'
import { isMobileApp } from './utils/isMobileApp'

const FALLBACK_DESCRIPTION = `Det här är ditt intyg. Intyget innehåller all information vården fyllt i. Du kan inte ändra något i ditt intyg. Har du frågor kontaktar du den som skrivit ditt intyg.`

export function CertificatePage() {
  const { id } = useParams()
  const { data: certificate, isLoading, error } = useGetCertificateQuery(id ? { id } : skipToken)

  return (
    <>
      <ScrollRestoration />
      <PageHeading heading="Läs och hantera ditt intyg">
        {certificate && (
          <>
            <CertificatePreambleText texts={certificate.texts} />
            {certificate.metadata.statuses.includes('REPLACED') && <CertificateReplacedAlert />}
          </>
        )}
        {error && <PageHeadingDescription>{FALLBACK_DESCRIPTION}</PageHeadingDescription>}
        <ReadMoreAboutAction />
      </PageHeading>

      {isLoading && <IDSSpinner data-testid="spinner" />}
      {error && <ReadCertificateError error={error} />}
      {certificate && (
        <>
          <div className="mb-5">
            <CertificateAttentionAlert availableFunctions={certificate.availableFunctions} />
            {isMobileApp() && (
              <IDSAlert className="mb-5">
                Om du vill skriva ut eller spara ditt intyg behöver du logga in på 1177.se via din webbläsare.
              </IDSAlert>
            )}
            <CertificateActions recipient={certificate.metadata.recipient} id={certificate.metadata.id} />
          </div>

          <div className="md:hidden">
            <PageDivider />
          </div>

          <IDSCard hideOnS>
            <div className="mb-5 flex flex-col justify-between gap-2.5 md:flex-row md:gap-5">
              <Heading level={2} size="m">
                {certificate.metadata.type.name}
              </Heading>
              <div className="flex gap-1">
                {certificate.metadata.statuses.map((status) => (
                  <CertificateStatusBadge key={status} status={status} />
                ))}
              </div>
            </div>
            <div className="mb-5">
              <CertificateInformation {...certificate.metadata} />
            </div>
            <div className="mb-5">
              <Heading level={3} size="xs" className="mb-0">
                Händelser
              </Heading>
              <CertificateEventsInfo events={certificate.metadata.events} />
            </div>

            <article className="ids-certificate">
              <CertificateBody content={certificate.content} />
              <CertificateFooter {...certificate.metadata} />
            </article>
          </IDSCard>
        </>
      )}
    </>
  )
}
