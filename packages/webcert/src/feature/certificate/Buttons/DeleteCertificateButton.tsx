import { ButtonWithConfirmModal } from '@frontend/common'
import { Typography } from '@material-ui/core'
import React from 'react'
import { deleteCertificate } from '../../../store/certificate/certificateActions'
import DeleteIcon from '@material-ui/icons/Delete'
import { useDispatch, useSelector } from 'react-redux'
import { getCertificateMetaData } from '../../../store/certificate/certificateSelectors'

const DeleteCertificateButton = () => {
  const dispatch = useDispatch()
  const certificateMetadata = useSelector(getCertificateMetaData)

  if (!certificateMetadata) return null

  return (
    <ButtonWithConfirmModal
      buttonText="Radera"
      buttonVariant="contained"
      startIcon={<DeleteIcon />}
      modalTitle="Radera utkast"
      onConfirm={() => {
        dispatch(deleteCertificate(certificateMetadata.certificateId))
      }}
      modalContent={<Typography>När du raderar utkastet tas det bort från webcert</Typography>}
      confirmButtonText="Radera"
      declineButtonText="Avbryt"></ButtonWithConfirmModal>
  )
}

export default DeleteCertificateButton
