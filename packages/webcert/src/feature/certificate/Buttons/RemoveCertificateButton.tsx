import { ButtonWithConfirmModal, CertificateMetadata } from '@frontend/common'
import React from 'react'
import { deleteCertificate } from '../../../store/certificate/certificateActions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'

interface Props {
  name: string
  description: string
  enabled: boolean
  certificateMetadata: CertificateMetadata
}

const RemoveCertificateButton: React.FC<Props> = ({ name, description, enabled, certificateMetadata }) => {
  const dispatch = useDispatch()

  return (
    <ButtonWithConfirmModal
      buttonStyle="secondary"
      disabled={!enabled}
      description={description}
      name={name}
      startIcon={<FontAwesomeIcon icon={faTrash} size={'lg'} />}
      modalTitle="Radera utkast"
      onConfirm={() => {
        dispatch(deleteCertificate(certificateMetadata.id))
      }}
      confirmButtonText="Radera"
      declineButtonText="Avbryt">
      <p>När du raderar utkastet tas det bort från webcert</p>
    </ButtonWithConfirmModal>
  )
}

export default RemoveCertificateButton
