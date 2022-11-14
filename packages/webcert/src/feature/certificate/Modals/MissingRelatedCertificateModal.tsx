import { ConfirmModal } from '@frontend/common'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createNewCertificate } from '../../../store/certificate/certificateActions'

interface Props {
  createCertificateType: string
  confirmButtonText: string
}

export const MissingRelatedCertificateModal: React.FC<Props> = ({ createCertificateType, confirmButtonText }) => {
  const [open, setOpen] = useState(true)
  const dispatch = useDispatch()

  return (
    <ConfirmModal
      modalTitle="Kontrollera namn och personnummer"
      confirmButtonText={confirmButtonText}
      disabled={false}
      setOpen={setOpen}
      open={open}
      onConfirm={() =>
        dispatch(createNewCertificate({ certificateType: createCertificateType, patientId: patient.personId.id }))
      }></ConfirmModal>
  )
}
