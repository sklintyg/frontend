import { IDSCard, IDSSpinner } from '@frontend/ids-react-ts'
import { skipToken } from '@reduxjs/toolkit/dist/query'
import { useParams } from 'react-router-dom'
import { PageHeading } from '../../components/PageHeading/PageHeading'
import { PageHeadingDescription } from '../../components/PageHeading/PageHeadingDescription'
import { useGetCertificateQuery } from '../../store/api'
import { CertificateInformation } from './components/CertificateInformation'
import { ReadCertificateError } from './components/ReadCertificateError'
import { SendCertificateActions } from './components/SendCertificateActions/SendCertificateActions'
import { AvailableFunctionsTypeEnum } from '../../schema/certificate.schema'
import {ReadMoreAboutAction} from "./components/ReadMoreAboutDialog/ReadMoreAboutAction";

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
      {error && <ReadCertificateError id={id} error={error} />}
      {certificate && recipient && sendFunction && (
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
