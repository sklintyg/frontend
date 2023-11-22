import { IDSSpinner } from '@frontend/ids-react-ts'
import { skipToken } from '@reduxjs/toolkit/query'
import { useParams } from 'react-router-dom'
import { PageDivider } from '../../components/PageDivider/PageDivider'
import { PageHeading } from '../../components/PageHeading/PageHeading'
import { PageHeadingDescription } from '../../components/PageHeading/PageHeadingDescription'
import { useGetCertificateQuery } from '../../store/api'
import { CertificateActions } from './components/CertificateActions/CertificateActions'
import { CertificateBody } from './components/CertificateBody/CertificateBody'
import { CertificateEventsInfo } from './components/CertificateEventsInfo/CertificateEventsInfo'
import { CertificateFooter } from './components/CertificateFooter'
import { CertificateInformation } from './components/CertificateInformation'
import { CertificateReplacedAlert } from './components/CertificateReplacedAlert'
import { CertificateStatusBadge } from './components/CertificateStatusBadge'
import { ReadCertificateError } from './components/ReadCertificateError'
import { CertificateAttentionAlert } from './components/CertificateAttentionAlert/CertificateAttentionAlert'
import { CertificatePreambleText } from './components/CertificatePremableText/CertificatePreambleText'
import { ReadMoreAboutAction } from './components/ReadMoreAboutDialog/ReadMoreAboutAction'

const FALLBACK_DESCRIPTION = `Det här är ditt intyg. Intyget innehåller all information vården fyllt i. Du kan inte ändra något i ditt intyg. Har du frågor kontaktar du den som skrivit ditt intyg.`

export function CertificatePage() {
  const { id } = useParams()
  const { data: certificate, isLoading, error } = useGetCertificateQuery(id ? { id } : skipToken)

  return (
    <>
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
      {error && <ReadCertificateError id={id} error={error} />}
      {certificate && (
        <>
          <div className="mb-5">
            <CertificateAttentionAlert availableFunctions={certificate.availableFunctions} />
            <CertificateActions
              recipient={certificate.metadata.recipient}
              availableFunctions={certificate.availableFunctions}
              id={certificate.metadata.id}
            />
          </div>

          <div className="md:hidden">
            <PageDivider />
          </div>

          <div className="rounded-[10px] border-stone-line md:border md:p-7 md:shadow-[0_0_2px_0px_rgba(0,0,0,0.3)]">
            <div className="mb-5 flex flex-col justify-between gap-2.5 md:flex-row md:gap-5">
              <h2 className="ids-heading-2">{certificate.metadata.type.name}</h2>
              <div className="flex gap-1">
                {certificate.metadata.statuses.map((status) => (
                  <CertificateStatusBadge key={status} status={status} />
                ))}
              </div>
            </div>
            <div className="mb-5">
              <CertificateInformation {...certificate.metadata} />
            </div>
            <h3 className="ids-heading-4 mb-0">Händelser</h3>
            <CertificateEventsInfo events={certificate.metadata.events} />

            <article className="ids-certificate">
              <CertificateBody content={certificate.content} />
              <CertificateFooter {...certificate.metadata} />
            </article>
          </div>
        </>
      )}
    </>
  )
}
