import { ButtonWithConfirmModal, CertificateMetadata, sanitizeText } from '@frontend/common'
import letter from '@frontend/common/src/images/epost.svg'
import React from 'react'
import { useDispatch } from 'react-redux'
import { sendCertificate } from '../../../store/certificate/certificateActions'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'

interface Props extends FunctionDisabled {
  name: string
  title?: string
  description: string
  body?: string
  enabled: boolean
  certificateMetadata: CertificateMetadata
}

const SendCertificateButton: React.FC<Props> = ({ name, title, description, enabled, body, certificateMetadata, functionDisabled }) => {
  const dispatch = useDispatch()

  return (
    <ButtonWithConfirmModal
      disabled={!enabled}
      description={description}
      name={name}
      modalTitle={title ?? name}
      startIcon={<img src={letter} alt="Skicka intyget" />}
      onConfirm={() => {
        dispatch(sendCertificate(certificateMetadata.id))
      }}
      confirmButtonText={name}
      declineButtonText="Avbryt"
      confirmButtonDisabled={functionDisabled}
      buttonTestId="send-certificate-button">
      {body && <div dangerouslySetInnerHTML={sanitizeText(body)} />}{' '}
    </ButtonWithConfirmModal>
  )
}

export default SendCertificateButton
