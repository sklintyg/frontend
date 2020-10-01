import { ButtonWithConfirmModal } from '@frontend/common'
import React, { useState } from 'react'
import { revokeCertificate, RevokeCertificateReason } from '../../../store/certificate/certificateActions'
import { RevokeCertificateModalContent } from './RevokeCertificateModalContent'
import DeleteIcon from '@material-ui/icons/Delete'
import { useDispatch } from 'react-redux'

const RevokeCertificateButton = () => {
  const [dispatchObject, setDispatchObject] = useState<null | RevokeCertificateReason>(null)
  const dispatch = useDispatch()

  const handleRevokeForm = (obj: RevokeCertificateReason) => {
    setDispatchObject(obj)
  }

  const handleDispatch = () => {
    if (dispatchObject) {
      dispatch(revokeCertificate(dispatchObject))
    }
  }

  const disabled = dispatchObject === null || dispatchObject.message.length < 1

  return (
    <ButtonWithConfirmModal
      confirmButtonDisabled={disabled}
      buttonText="Makulera"
      startIcon={<DeleteIcon />}
      modalTitle="Makulera intyg"
      onConfirm={handleDispatch}
      confirmButtonText="Makulera">
      <RevokeCertificateModalContent onChange={handleRevokeForm} />
    </ButtonWithConfirmModal>
  )
}

export default RevokeCertificateButton
