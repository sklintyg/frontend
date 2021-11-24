import { ModalProps } from './ModalUtils'
import React from 'react'
import ErrorModalBase from './ErrorModalBase'

const COMPLEMENT_CERTIFICATE_EXISTS_MESSAGE = 'Intyget kunde inte förnyas eftersom det har blivit kompletterat av ett senare intyg.'

const ComplementaryCertificateExists: React.FC<ModalProps> = ({ errorData }) => {
  return (
    <ErrorModalBase errorData={errorData}>
      <p>{COMPLEMENT_CERTIFICATE_EXISTS_MESSAGE}</p>
    </ErrorModalBase>
  )
}

export default ComplementaryCertificateExists
