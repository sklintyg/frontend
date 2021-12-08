import { ButtonWithConfirmModal, CertificateMetadata, FunctionDisabled } from '@frontend/common'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { sendCertificate } from '../../../store/certificate/certificateActions'
import { useDispatch } from 'react-redux'

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
      startIcon={<FontAwesomeIcon size="lg" icon={faEnvelope} />}
      onConfirm={() => {
        dispatch(sendCertificate(certificateMetadata.id))
      }}
      confirmButtonText={name}
      declineButtonText="Avbryt"
      confirmButtonDisabled={functionDisabled}>
      {body && <div dangerouslySetInnerHTML={{ __html: body }} />}{' '}
    </ButtonWithConfirmModal>
  )
}

export default SendCertificateButton
