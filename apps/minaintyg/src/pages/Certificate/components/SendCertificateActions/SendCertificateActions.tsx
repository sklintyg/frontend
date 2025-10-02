import { IDSButton } from '@inera/ids-react'
import { useNavigate } from 'react-router-dom'
import type { AvailableFunction, CertificateRecipient } from '../../../../schema/certificate.schema'
import { useSendCertificateMutation } from '../../../../store/api'
import { SendCertificateErrorAlert } from './SendCertificateErrorAlert'
import { SendCertificateSuccessAlert } from './SendCertificateSuccessAlert'

export function SendCertificateActions({
  id,
  recipient,
  sendFunction,
}: {
  id: string
  recipient: CertificateRecipient
  sendFunction: AvailableFunction
}) {
  const [sendCertificate, { isLoading, error, isSuccess }] = useSendCertificateMutation()
  const navigate = useNavigate()

  return (
    <>
      {error && <SendCertificateErrorAlert recipient={recipient} error={error} />}
      {recipient.sent && <SendCertificateSuccessAlert recipient={recipient} />}
      <div className="flex flex-col gap-5 py-5 sm:flex-row">
        <IDSButton role="button" sBlock secondary={!isSuccess} onClick={() => navigate('..')}>
          Tillbaka till intyget
        </IDSButton>
        {sendFunction.enabled && (
          <IDSButton role="button" sBlock onClick={() => !isLoading && sendCertificate({ id })}>
            Skicka
          </IDSButton>
        )}
      </div>
    </>
  )
}
