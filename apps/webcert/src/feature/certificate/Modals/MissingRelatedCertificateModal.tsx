import { ConfirmModal, Patient, ResourceLink, sanitizeText } from '@frontend/common'
import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { createNewCertificate } from '../../../store/certificate/certificateActions'

interface Props extends ResourceLink {
  createCertificateType: string
  confirmButtonText: string
  patient: Patient
  setOpen: (val: boolean) => void
  open: boolean
}

const ModalContent = styled.div`
  white-space: pre-line;
`

export const MissingRelatedCertificateModal: React.FC<Props> = ({
  createCertificateType,
  confirmButtonText,
  patient,
  setOpen,
  open,
  body,
  name,
  title,
  enabled,
}) => {
  const dispatch = useDispatch()

  return (
    <ConfirmModal
      modalTitle={title ?? name}
      confirmButtonText={confirmButtonText}
      disabled={!enabled}
      setOpen={setOpen}
      open={open}
      onConfirm={() => dispatch(createNewCertificate({ certificateType: createCertificateType, patientId: patient.personId.id }))}
    >
      <ModalContent dangerouslySetInnerHTML={sanitizeText(body as string)}></ModalContent>
    </ConfirmModal>
  )
}
