import React from 'react'
import { useDispatch } from 'react-redux'
import { ButtonWithConfirmModal, CertificateMetadata, sanitizeText } from '@frontend/common'
import { createCertificateFromTemplate } from '../../../store/certificate/certificateActions'
import { useHistory } from 'react-router-dom'
import fileIcon from '@frontend/common/src/images/file.svg'

interface Props {
  name: string
  description: string
  enabled: boolean
  body?: string
  certificateMetadata: CertificateMetadata
}

const CreateCertificateFromTemplateButton: React.FC<Props> = ({ name, description, enabled, body }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const handleConfirm = () => {
    dispatch(createCertificateFromTemplate(history))
  }

  return (
    <ButtonWithConfirmModal
      disabled={!enabled}
      onConfirm={handleConfirm}
      modalTitle={name}
      confirmButtonText={name}
      name={name}
      description={description}
      startIcon={<img src={fileIcon} alt="Skapa utkast" />}
      buttonTestId="create-certificate-from-template-button">
      <div className={'iu-pb-400'} dangerouslySetInnerHTML={sanitizeText(body as string)}></div>
    </ButtonWithConfirmModal>
  )
}

export default CreateCertificateFromTemplateButton
