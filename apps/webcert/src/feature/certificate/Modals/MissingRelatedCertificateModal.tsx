import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { ConfirmModal } from '../../../components/utils/Modal/ConfirmModal'
import { createNewCertificate } from '../../../store/certificate/certificateActions'
import type { Patient, ResourceLink } from '../../../types'
import { sanitizeText } from '../../../utils'

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

export const MissingRelatedCertificateModal = ({
  createCertificateType,
  confirmButtonText,
  patient,
  setOpen,
  open,
  body,
  name,
  title,
  enabled,
}: Props) => {
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
