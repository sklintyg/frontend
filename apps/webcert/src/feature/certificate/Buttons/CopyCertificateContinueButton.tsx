import type React from 'react'
import { useHistory } from 'react-router-dom'
import type { FunctionDisabled } from '../../../utils/functionDisablerUtils'
import ButtonWithConfirmModal from '../../../components/utils/Modal/ButtonWithConfirmModal'
import { CopyIcon } from '../../../images'
import type { CertificateMetadata } from '../../../types'

interface Props extends FunctionDisabled {
  name: string
  description: string
  enabled: boolean
  certificateMetadata: CertificateMetadata
}

const CopyCertificateContinueButton: React.FC<Props> = ({ name, description, enabled, certificateMetadata, functionDisabled }) => {
  const history = useHistory()

  const handleConfirm = () => {
    return () => history.push(`/certificate/${certificateMetadata.relations.children[0].certificateId}`)
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
