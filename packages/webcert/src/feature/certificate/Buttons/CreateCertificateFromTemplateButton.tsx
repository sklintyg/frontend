import React from 'react'
import { useDispatch } from 'react-redux'
import { ButtonWithConfirmModal, CertificateMetadata } from '@frontend/common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { createCertificateFromTemplate } from '../../../store/certificate/certificateActions'
import { useHistory } from 'react-router-dom'

interface Props {
  name: string
  description: string
  enabled: boolean
  body?: string
  certificateMetadata: CertificateMetadata
}

const CreateCertificateFromTemplateButton: React.FC<Props> = ({ name, description, enabled, body, certificateMetadata: propMetaData }) => {
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
      startIcon={<FontAwesomeIcon icon={faSyncAlt} size="lg"></FontAwesomeIcon>}>
      <div className={'iu-pb-400'} dangerouslySetInnerHTML={{ __html: body as string }}></div>
    </ButtonWithConfirmModal>
  )
}

export default CreateCertificateFromTemplateButton
