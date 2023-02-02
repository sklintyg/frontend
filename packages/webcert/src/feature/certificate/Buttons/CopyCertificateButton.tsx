import React from 'react'
import { ButtonWithConfirmModal, CertificateMetadata, sanitizeText } from '@frontend/common'
import { useDispatch } from 'react-redux'
import { copyCertificate } from '../../../store/certificate/certificateActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'

interface Props extends FunctionDisabled {
  name: string
  description: string
  body?: string
  enabled: boolean
  certificateMetadata: CertificateMetadata
}

const CopyCertificateButton: React.FC<Props> = ({ name, description, body, enabled, functionDisabled }) => {
  const dispatch = useDispatch()

  const handleConfirm = () => {
    return () => dispatch(copyCertificate())
  }

  return (
    <ButtonWithConfirmModal
      name={name}
      description={description}
      disabled={!enabled}
      startIcon={<FontAwesomeIcon icon={faCopy} size="lg" />}
      modalTitle="Kopiera låst utkast"
      onConfirm={handleConfirm()}
      confirmButtonText={'Kopiera'}
      confirmButtonDisabled={functionDisabled}
      buttonTestId="copy-certificate-button">
      <div dangerouslySetInnerHTML={sanitizeText(body as string)}></div>
    </ButtonWithConfirmModal>
  )
}

export default CopyCertificateButton
