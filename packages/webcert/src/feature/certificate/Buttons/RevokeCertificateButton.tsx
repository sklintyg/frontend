import { ButtonWithConfirmModal } from '@frontend/common'
import React, { useState } from 'react'
import { revokeCertificate, RevokeCertificateReason } from '../../../store/certificate/certificateActions'
import { RevokeCertificateModalContent } from './RevokeCertificateModalContent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'

interface Props {
  name: string
  description: string
  enabled: boolean
}

const RevokeCertificateButton: React.FC<Props> = ({ name, description, enabled }) => {
  const [dispatchObject, setDispatchObject] = useState<null | RevokeCertificateReason>(null)
  const dispatch = useDispatch()
  const [confirmButtonDisabled, setConfirmButtonDisabled] = useState(true)

  const handleRevokeForm = (obj: RevokeCertificateReason) => {
    setDispatchObject(obj)
    const disabledConfirmButton = handleDisabled(obj)

    setConfirmButtonDisabled(disabledConfirmButton)
  }

  const handleDispatch = () => {
    if (dispatchObject) {
      dispatch(revokeCertificate(dispatchObject))
    }
  }

  const handleDisabled = (dispatchObject: RevokeCertificateReason): boolean => {
    if (dispatchObject.message.length > 0 && dispatchObject.reason === 'ANNAT_ALLVARLIGT_FEL') {
      return false
    } else if (dispatchObject.reason === 'FEL_PATIENT') {
      return false
    }
    return true
  }

  return (
    <ButtonWithConfirmModal
      onClose={() => setConfirmButtonDisabled(true)}
      confirmButtonDisabled={confirmButtonDisabled}
      buttonStyle="secondary"
      name={name}
      disabled={!enabled}
      description={description}
      startIcon={<FontAwesomeIcon size="lg" icon={faTrash} />}
      modalTitle="Makulera intyg"
      onConfirm={handleDispatch}
      confirmButtonText="Makulera">
      <RevokeCertificateModalContent onChange={handleRevokeForm} />
    </ButtonWithConfirmModal>
  )
}

export default RevokeCertificateButton
