import ButtonWithConfirmModal from '../../../components/utils/Modal/ButtonWithConfirmModal'
import { trashImage } from '../../../images'
import { getIsValidating } from '../../../store/certificate/certificateSelectors'
import { useAppSelector } from '../../../store/store'
import type { CertificateMetadata } from '../../../types'
import { useDeleteCertificate } from '../hooks/useDeleteCertificate'

interface Props {
  name: string
  description: string
  enabled: boolean
  certificateMetadata: CertificateMetadata
  functionDisabled: boolean
}

function RemoveCertificateButton({ name, description, enabled, certificateMetadata, functionDisabled }: Readonly<Props>) {
  const isValidating = useAppSelector(getIsValidating)
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
