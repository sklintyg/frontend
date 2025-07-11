import type { ModalProps } from './errorUtils'
import ReloadModal from './ReloadModal'

export const CERTIFICATE_REVOKED_TITLE = 'Operation är inte möjlig'
export const CERTIFICATE_REVOKED_MESSAGE =
  'Förmodligen har en annan användare makulerat intyget medan du arbetat på samma post. Ladda om sidan och försök igen.'

const CertificateRevoked = ({ errorData }: ModalProps) => {
  return (
    <ReloadModal errorData={errorData}>
      <p>
        <strong>{CERTIFICATE_REVOKED_TITLE}</strong>
      </p>
      <p>{CERTIFICATE_REVOKED_MESSAGE}</p>
    </ReloadModal>
  )
}

export default CertificateRevoked
