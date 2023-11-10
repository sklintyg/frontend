import { IDSCard, IDSSpinner } from '@frontend/ids-react-ts'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useParams } from 'react-router-dom'
import { PageHeading } from '../../components/PageHeading/PageHeading'
import { PageHeadingDescription } from '../../components/PageHeading/PageHeadingDescription'
import { useGetCertificateQuery } from '../../store/api'
import { CertificateInformation } from './components/CertificateInformation'
import { ReadCertificateError } from './components/ReadCertificateError'
import { SendCertificateActions } from './components/SendCertificateActions/SendCertificateActions'

export function SendCertificatePage() {
  const { id } = useParams()
  const { data: certificate, isLoading, error } = useGetCertificateQuery(id ? { id } : skipToken)
  const { recipient } = certificate?.metadata || {}

  return (
    <>
      <PageHeading heading="Skicka intyg ">
        <PageHeadingDescription>
          Från den här sidan kan du välja att skicka ditt intyg digitalt till mottagaren. Endast mottagare som kan ta emot digitala intyg
          visas nedan.
        </PageHeadingDescription>
      </PageHeading>
      {isLoading && <IDSSpinner data-testid="spinner" />}
      {error && <ReadCertificateError id={id} error={error} />}
      {certificate && recipient && (
        <>
          <div>
            <h2 className="ids-heading-2 mb-5">Intyg som ska skickas</h2>
            <IDSCard className="mb-5">
              <h2 className="ids-heading-3">{certificate.metadata.type.name}</h2>
              <CertificateInformation {...certificate.metadata} />
            </IDSCard>
          </div>
          <div className="mb-5">
            <h2 className="ids-heading-2 mb-5">Mottagare</h2>
            <IDSCard>{recipient.name}</IDSCard>
          </div>
          {id && <SendCertificateActions id={id} recipient={recipient} />}
        </>
      )}
    </>
  )
}
