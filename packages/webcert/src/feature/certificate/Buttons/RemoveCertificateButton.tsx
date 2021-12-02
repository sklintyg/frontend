import { ButtonWithConfirmModal, CertificateMetadata } from '@frontend/common'
import React from 'react'
import { deleteCertificate } from '../../../store/certificate/certificateActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

interface Props {
  name: string
  description: string
  enabled: boolean
  certificateMetadata: CertificateMetadata
}

const RemoveCertificateButton: React.FC<Props> = ({ name, description, enabled, certificateMetadata }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  return (
    <ButtonWithConfirmModal
      buttonStyle="secondary"
      disabled={!enabled}
      description={description}
      name={name}
      startIcon={<FontAwesomeIcon icon={faTrash} size={'lg'} />}
      modalTitle="Radera utkast"
      onConfirm={() => {
        dispatch(deleteCertificate({ certificateId: certificateMetadata.id, history: history }))
      }}
      confirmButtonText="Radera"
      declineButtonText="Avbryt">
      <p>När du raderar utkastet tas det bort från webcert.</p>
    </ButtonWithConfirmModal>
  )
}

export default RemoveCertificateButton
