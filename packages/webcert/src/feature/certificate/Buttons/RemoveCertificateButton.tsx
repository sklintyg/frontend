import { ButtonWithConfirmModal, CertificateMetadata } from '@frontend/common'
import React from 'react'
import { deleteCertificate } from '../../../store/certificate/certificateActions'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { FunctionDisabled } from '../../../utils/functionDisablerUtils'
import trash from '@frontend/common/src/images/trash.svg'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
  certificateMetadata: CertificateMetadata
}

const RemoveCertificateButton: React.FC<Props> = ({ name, description, enabled, certificateMetadata, functionDisabled }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  return (
    <ButtonWithConfirmModal
      buttonStyle="secondary"
      disabled={!enabled}
      description={description}
      name={name}
      startIcon={<img src={trash} alt="Radera utkast" />}
      modalTitle="Radera utkast"
      onConfirm={() => {
        dispatch(deleteCertificate({ certificateId: certificateMetadata.id, history: history }))
      }}
      confirmButtonText="Radera"
      declineButtonText="Avbryt"
      confirmButtonDisabled={functionDisabled}>
      <p>När du raderar utkastet tas det bort från webcert.</p>
    </ButtonWithConfirmModal>
  )
}

export default RemoveCertificateButton
