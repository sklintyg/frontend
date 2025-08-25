import { Heading } from '@frontend/components'
import { IDSCard, IDSSpinner } from '@inera/ids-react'
import { skipToken } from '@reduxjs/toolkit/query'
import { useParams } from 'react-router-dom'
import { PageHeading } from '../../components/PageHeading/PageHeading'
import { PageHeadingDescription } from '../../components/PageHeading/PageHeadingDescription'
import { AvailableFunctionsTypeEnum } from '../../schema/certificate.schema'
import { useGetCertificateQuery } from '../../store/api'
import { CertificateInformation } from './components/CertificateInformation'
import { ReadCertificateError } from './components/ReadCertificateError'
import { ReadMoreAboutAction } from './components/ReadMoreAboutDialog/ReadMoreAboutAction'
import { SendCertificateActions } from './components/SendCertificateActions/SendCertificateActions'

export function SendCertificatePage() {
  const { id } = useParams()
  const { data: certificate, isLoading, error } = useGetCertificateQuery(id ? { id } : skipToken)
  const { recipient } = certificate?.metadata || {}
  const sendFunction = certificate?.availableFunctions.find(
    (availableFunction) => availableFunction.type === AvailableFunctionsTypeEnum.enum.SEND_CERTIFICATE
  )

  return (
    <>
      <PageHeading heading="Skicka intyg ">
        <PageHeadingDescription>{sendFunction?.body}</PageHeadingDescription>
        <ReadMoreAboutAction />
      </PageHeading>
      {isLoading && <IDSSpinner data-testid="spinner" />}
      {error && <ReadCertificateError error={error} />}
      {certificate && recipient && sendFunction && (
        <>
          <div>
            <Heading level={2} size="m">
              Intyg som ska skickas
            </Heading>
            <div className="mb-5">
              <IDSCard>
                <Heading level={2} size="s">
                  {certificate.metadata.type.name}
                </Heading>
                <CertificateInformation {...certificate.metadata} />
              </IDSCard>
            </div>
          </div>
          <div className="mb-5">
            <Heading level={2} size="m">
              Mottagare
            </Heading>
            <IDSCard>{recipient.name}</IDSCard>
          </div>
          {id && <SendCertificateActions id={id} recipient={recipient} sendFunction={sendFunction} />}
        </>
      )}
    </>
  )
}
