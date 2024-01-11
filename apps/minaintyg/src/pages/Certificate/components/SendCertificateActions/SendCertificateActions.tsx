import { IDSButton } from '@frontend/ids-react-ts'
import { useNavigate } from 'react-router-dom'
import { SendCertificateErrorAlert } from './SendCertificateErrorAlert'
import { SendCertificateSuccessAlert } from './SendCertificateSuccessAlert'
import { AvailableFunction, CertificateRecipient } from '../../../../schema/certificate.schema'
import { useSendCertificateMutation } from '../../../../store/api'

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
        <IDSButton role="button" sblock secondary={!isSuccess} onClick={() => navigate('..')}>
          Tillbaka till intyget
        </IDSButton>
        {sendFunction.enabled && (
          <IDSButton role="button" sblock onClick={() => !isLoading && sendCertificate({ id })}>
            Skicka
          </IDSButton>
        )}
      </div>
    </>
  )
}
