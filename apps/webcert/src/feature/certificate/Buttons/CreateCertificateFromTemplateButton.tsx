import React from 'react'
import { useDispatch } from 'react-redux'
import { createCertificateFromTemplate } from '../../../store/certificate/certificateActions'
import ButtonWithConfirmModal from '../../../components/utils/Modal/ButtonWithConfirmModal'
import { fileImage } from '../../../images'
import { CertificateMetadata } from '../../../types'
import { sanitizeText } from '../../../utils'

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

  const handleConfirm = () => {
    dispatch(createCertificateFromTemplate())
  }

  return (
    <ButtonWithConfirmModal
      disabled={!enabled}
      onConfirm={handleConfirm}
      modalTitle={title ?? name}
      confirmButtonText={name}
      name={name}
      description={description}
      startIcon={<img src={fileImage} alt="Skapa utkast" />}
      buttonTestId="create-certificate-from-template-button"
    >
      <div className={'iu-pb-400'} dangerouslySetInnerHTML={sanitizeText(body as string)}></div>
    </ButtonWithConfirmModal>
  )
}

export default CreateCertificateFromTemplateButton
