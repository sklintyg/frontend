import { ConfirmModal, Patient, ResourceLink } from '@frontend/common'
import React from 'react'
import { useDispatch } from 'react-redux'
import { createNewCertificate } from '../../../store/certificate/certificateActions'

interface Props extends ResourceLink {
  createCertificateType: string
  confirmButtonText: string
  patient: Patient
  setOpen: (val: boolean) => void
  open: boolean
}

export const MissingRelatedCertificateModal: React.FC<Props> = ({
  createCertificateType,
  confirmButtonText,
  patient,
  setOpen,
  open,
  body,
  name,
  enabled,
}) => {
  const dispatch = useDispatch()

  return (
    <ConfirmModal
      modalTitle={name}
      confirmButtonText={confirmButtonText}
      disabled={!enabled}
      setOpen={setOpen}
      open={open}
      onConfirm={() => dispatch(createNewCertificate({ certificateType: createCertificateType, patientId: patient.personId.id }))}>
      {body}
    </ConfirmModal>
  )
}
