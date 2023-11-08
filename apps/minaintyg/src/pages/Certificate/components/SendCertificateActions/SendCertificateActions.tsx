import { IDSButton } from '@frontend/ids-react-ts'
import { useNavigate } from 'react-router-dom'
import { CertificateRecipient } from '../../../../schema/certificate.schema'
import { useSendCertificateMutation } from '../../../../store/api'
import { SendCertificateErrorAlert } from './SendCertificateErrorAlert'
import { SendCertificateSuccessAlert } from './SendCertificateSuccessAlert'

export function SendCertificateActions({ id, recipient }: { id: string; recipient: CertificateRecipient }) {
  const [sendCertificate, { isLoading, isError, isSuccess }] = useSendCertificateMutation()
  const navigate = useNavigate()

  return (
    <>
      {isError && <SendCertificateErrorAlert recipient={recipient} />}
      {isSuccess && recipient.sent && <SendCertificateSuccessAlert recipient={recipient} />}
      <div className="flex flex-col gap-5 py-5 sm:flex-row">
        <IDSButton role="button" sblock secondary={!isSuccess} onClick={() => navigate('..')}>
          Tillbaka till intyget
        </IDSButton>

        {!isSuccess && (
          <IDSButton role="button" sblock onClick={() => !isLoading && sendCertificate({ id })}>
            Skicka
          </IDSButton>
        )}
      </div>
    </>
  )
}
