import { ButtonWithConfirmModal, CertificateMetadata, sanitizeText } from '@frontend/common'
import React from 'react'
import { sendCertificate } from '../../../store/certificate/certificateActions'
import { useDispatch } from 'react-redux'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'
import letter from '@frontend/common/src/images/epost.svg'

interface Props extends FunctionDisabled {
  name: string
  description: string
  body?: string
  enabled: boolean
  certificateMetadata: CertificateMetadata
}

const SendCertificateButton: React.FC<Props> = ({ name, description, enabled, body, certificateMetadata, functionDisabled }) => {
  const dispatch = useDispatch()

  return (
    <ButtonWithConfirmModal
      disabled={!enabled}
      description={description}
      name={name}
      modalTitle={name}
      startIcon={<img src={letter} alt={'Logo Skicka intyget'} />}
      onConfirm={() => {
        dispatch(sendCertificate(certificateMetadata.id))
      }}
      confirmButtonText={name}
      declineButtonText="Avbryt"
      confirmButtonDisabled={functionDisabled}>
      {body && <div dangerouslySetInnerHTML={sanitizeText(body)} />}{' '}
    </ButtonWithConfirmModal>
  )
}

export default SendCertificateButton
