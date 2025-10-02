import { useNavigate } from 'react-router-dom'
import ButtonWithConfirmModal from '../../../components/utils/Modal/ButtonWithConfirmModal'
import { CopyIcon } from '../../../images'
import type { CertificateMetadata } from '../../../types'

interface Props {
  name: string
  description: string
  enabled: boolean
  certificateMetadata: CertificateMetadata
  functionDisabled: boolean
}

const CopyCertificateContinueButton = ({ name, description, enabled, certificateMetadata, functionDisabled }: Props) => {
  const navigate = useNavigate()

  const handleConfirm = () => {
    return () => navigate(`/certificate/${certificateMetadata.relations.children[0].certificateId}`)
  }

  return (
    <ButtonWithConfirmModal
      name={name}
      description={description}
      disabled={!enabled}
      startIcon={<CopyIcon style={{ height: '1.33rem', width: 'auto' }} />}
      modalTitle="Kopiera låst utkast"
      onConfirm={handleConfirm()}
      confirmButtonText={'Fortsätt på utkast'}
      confirmButtonDisabled={functionDisabled}
      buttonTestId="copy-certificate-continue-button"
    >
      <p>
        Genom att kopiera ett låst intygsutkast skapas ett nytt utkast med samma information som i det ursprungliga låsta utkastet. Du kan
        redigera utkastet innan du signerar det. Det ursprungliga låsta utkastet finns kvar.{' '}
      </p>
    </ButtonWithConfirmModal>
  )
}

export default CopyCertificateContinueButton
