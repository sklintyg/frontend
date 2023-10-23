import { IDSButton } from '@frontend/ids-react-ts'
import { useNavigate } from 'react-router-dom'
import { CertificateRecipient } from '../../../../schema/certificate.schema'
import { useSendCertificateMutation } from '../../../../store/api'
import { SendCertificateErrorAlert } from './SendCertificateErrorAlert'
import { SendCertificateSuccessAlert } from './SendCertificateSuccessAlert'

export function SendCertificateActions({ id, recipient }: { id: string; recipient: CertificateRecipient }) {
  const [sendCertificate, { isLoading: isSendingCertificate, isError: isSendingCertificateError, isSuccess: isSendingCertificateSuccess }] =
    useSendCertificateMutation()
  const navigate = useNavigate()

  return (
    <>
      {isSendingCertificateError && <SendCertificateErrorAlert recipient={recipient} />}
      {isSendingCertificateSuccess && recipient.sent && <SendCertificateSuccessAlert recipient={recipient} />}
      <div className="flex flex-col gap-5 py-5 sm:flex-row">
        {isSendingCertificateSuccess ? (
          <IDSButton role="button" sblock key="back" onClick={() => navigate('..')}>
            Tillbaka till intyget
          </IDSButton>
        ) : (
          <>
            <IDSButton role="button" sblock secondary onClick={() => navigate('..')}>
              Avbryt
            </IDSButton>
            <IDSButton role="button" sblock onClick={() => !isSendingCertificate && sendCertificate({ id })}>
              Skicka
            </IDSButton>
          </>
        )}
      </div>
    </>
  )
}
