import React from 'react'
import WCDynamicLink from '../../../utils/WCDynamicLink'
import ErrorModalBase from './ErrorModalBase'
import { ModalProps } from './errorUtils'

export const SIGN_CERTIFICATE_ERROR_TITLE = 'Signering misslyckades'

const SignCertificateError: React.FC<ModalProps> = ({ errorData }) => {
  return (
    <ErrorModalBase errorData={errorData}>
      <p>
        <strong>{SIGN_CERTIFICATE_ERROR_TITLE}</strong>
      </p>
      <p>Intyget har inte signerats. Detta beror på ett tekniskt fel eller att signeringen avbrutits.</p>
      <p>
        Prova igen om en stund. Om problemet kvarstår, kontakta i första hand din lokala IT-avdelning och i andra hand{' '}
        <WCDynamicLink linkKey="ineraKundserviceAnmalFel" />.
      </p>
    </ErrorModalBase>
  )
}

export default SignCertificateError
