import type React from 'react'
import { useSelector } from 'react-redux'
import { getIsValidating } from '../../../store/certificate/certificateSelectors'
import type { FunctionDisabled } from '../../../utils/functionDisablerUtils'
import { useDeleteCertificate } from '../hooks/useDeleteCertificate'
import ButtonWithConfirmModal from '../../../components/utils/Modal/ButtonWithConfirmModal'
import { trashImage } from '../../../images'
import type { CertificateMetadata } from '../../../types'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
  certificateMetadata: CertificateMetadata
}

const RemoveCertificateButton: React.FC<Props> = ({ name, description, enabled, certificateMetadata, functionDisabled }) => {
  const isValidating = useSelector(getIsValidating)
  const deleteCertificate = useDeleteCertificate(certificateMetadata.id)

  return (
    <ButtonWithConfirmModal
      buttonStyle="secondary"
      disabled={!enabled || isValidating}
      description={description}
      name={name}
      startIcon={<img src={trashImage} alt="Radera utkast" />}
      modalTitle="Radera utkast"
      onConfirm={deleteCertificate}
      confirmButtonText="Radera"
      declineButtonText="Avbryt"
      buttonTestId="remove-certificate-button"
      confirmButtonDisabled={functionDisabled}
    >
      <p>När du raderar utkastet tas det bort från webcert.</p>
    </ButtonWithConfirmModal>
  )
}

export default RemoveCertificateButton
