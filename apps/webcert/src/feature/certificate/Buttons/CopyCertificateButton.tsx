import { useDispatch } from 'react-redux'
import ButtonWithConfirmModal from '../../../components/utils/Modal/ButtonWithConfirmModal'
import { CopyIcon } from '../../../images'
import { copyCertificate } from '../../../store/certificate/certificateActions'
import type { CertificateMetadata } from '../../../types'
import { sanitizeText } from '../../../utils'
import type { FunctionDisabled } from '../../../utils/functionDisablerUtils'

interface Props extends FunctionDisabled {
  name: string
  description: string
  body?: string
  enabled: boolean
  certificateMetadata: CertificateMetadata
}

const CopyCertificateButton = ({ name, description, body, enabled, functionDisabled }: Props) => {
  const dispatch = useDispatch()

  const handleConfirm = () => {
    return () => dispatch(copyCertificate())
  }

  return (
    <ButtonWithConfirmModal
      name={name}
      description={description}
      disabled={!enabled}
      startIcon={<CopyIcon style={{ height: '1.33rem', width: 'auto' }} />}
      modalTitle="Kopiera låst utkast"
      onConfirm={handleConfirm()}
      confirmButtonText={'Kopiera'}
      confirmButtonDisabled={functionDisabled}
      buttonTestId="copy-certificate-button"
    >
      <div dangerouslySetInnerHTML={sanitizeText(body as string)}></div>
    </ButtonWithConfirmModal>
  )
}

export default CopyCertificateButton
