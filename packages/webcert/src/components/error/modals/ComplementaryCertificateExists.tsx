import React from 'react'
import ErrorModalBase from './ErrorModalBase'
import { ModalProps } from './errorUtils'
import { INVALID_STATE_TITLE } from './InvalidState'

export const COMPLEMENTARY_CERTIFICATE_EXISTS_MESSAGE = 'Intyget har blivit kompletterat av ett senare intyg.'

const ComplementaryCertificateExists: React.FC<ModalProps> = ({ errorData }) => {
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
