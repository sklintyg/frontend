import ErrorModalBase from './ErrorModalBase'
import type { ModalProps } from './errorUtils'

const INVALID_STATE_TITLE = 'Funktionen är inte giltig'
export const COMPLEMENTARY_CERTIFICATE_EXISTS_MESSAGE = 'Intyget har blivit kompletterat av ett senare intyg.'

const ComplementaryCertificateExists = ({ errorData }: ModalProps) => {
  return (
    <ErrorModalBase errorData={errorData}>
      <p>
        <strong>{INVALID_STATE_TITLE}</strong>
      </p>
      <p>{COMPLEMENTARY_CERTIFICATE_EXISTS_MESSAGE}</p>
    </ErrorModalBase>
  )
}

export default ComplementaryCertificateExists
