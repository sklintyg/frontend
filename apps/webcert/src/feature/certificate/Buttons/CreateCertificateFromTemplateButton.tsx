import { useDispatch } from 'react-redux'
import ButtonWithConfirmModal from '../../../components/utils/Modal/ButtonWithConfirmModal'
import { fileImage } from '../../../images'
import { createCertificateFromTemplate } from '../../../store/certificate/certificateActions'
import type { CertificateMetadata } from '../../../types'
import { sanitizeText } from '../../../utils'

interface Props {
  name: string
  title?: string
  description: string
  enabled: boolean
  body?: string
  certificateMetadata: CertificateMetadata
}

const CreateCertificateFromTemplateButton = ({ name, title, description, enabled, body }: Props) => {
  const dispatch = useDispatch()

  const handleConfirm = () => {
    dispatch(createCertificateFromTemplate())
  }

  return (
    <ButtonWithConfirmModal
      disabled={!enabled}
      onConfirm={handleConfirm}
      modalTitle={title ?? name}
      confirmButtonText={name}
      name={name}
      description={description}
      startIcon={<img src={fileImage} alt="Skapa utkast" />}
      buttonTestId="create-certificate-from-template-button"
    >
      <div className={'iu-pb-400'} dangerouslySetInnerHTML={sanitizeText(body as string)}></div>
    </ButtonWithConfirmModal>
  )
}

export default CreateCertificateFromTemplateButton
