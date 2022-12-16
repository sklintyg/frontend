import { ButtonWithConfirmModal, CertificateMetadata, sanitizeText } from '@frontend/common'
import fileIcon from '@frontend/common/src/images/file.svg'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { createCertificateFromTemplate } from '../../../store/certificate/certificateActions'

interface Props {
  name: string
  title?: string
  description: string
  enabled: boolean
  body?: string
  certificateMetadata: CertificateMetadata
}

const CreateCertificateFromTemplateButton: React.FC<Props> = ({ name, title, description, enabled, body }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const handleConfirm = () => {
    dispatch(createCertificateFromTemplate(history))
  }

  return (
    <ButtonWithConfirmModal
      disabled={!enabled}
      onConfirm={handleConfirm}
      modalTitle={title ?? name}
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
