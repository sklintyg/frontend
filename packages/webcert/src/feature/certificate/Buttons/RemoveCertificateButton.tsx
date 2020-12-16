import { ButtonWithConfirmModal } from '@frontend/common'
import { Typography } from '@material-ui/core'
import React from 'react'
import { deleteCertificate } from '../../../store/certificate/certificateActions'
import DeleteIcon from '@material-ui/icons/Delete'
import { useDispatch, useSelector } from 'react-redux'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'

interface Props {
  name: string
  description: string
  enabled: boolean
}

const RemoveCertificateButton: React.FC<Props> = ({ name, description, enabled }) => {
  const dispatch = useDispatch()
  const certificateMetadata = useSelector(getCertificateMetaData)

  if (!certificateMetadata) return null

  return (
    <ButtonWithConfirmModal
      buttonStyle="secondary"
      disabled={!enabled}
      description={description}
      name={name}
      startIcon={<DeleteIcon />}
      modalTitle="Radera utkast"
      onConfirm={() => {
        dispatch(deleteCertificate(certificateMetadata.certificateId))
      }}
      confirmButtonText="Radera"
      declineButtonText="Avbryt">
      <Typography>När du raderar utkastet tas det bort från webcert</Typography>
    </ButtonWithConfirmModal>
  )
}

export default RemoveCertificateButton
