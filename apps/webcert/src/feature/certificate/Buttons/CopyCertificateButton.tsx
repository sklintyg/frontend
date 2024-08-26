import type React from 'react'
import { useDispatch } from 'react-redux'
import { copyCertificate } from '../../../store/certificate/certificateActions'
import type { FunctionDisabled } from '../../../utils/functionDisablerUtils'
import ButtonWithConfirmModal from '../../../components/utils/Modal/ButtonWithConfirmModal'
import { CopyIcon } from '../../../images'
import type { CertificateMetadata } from '../../../types'
import { sanitizeText } from '../../../utils'

interface Props extends FunctionDisabled {
  name: string
  description: string
  body?: string
  enabled: boolean
  certificateMetadata: CertificateMetadata
}

const CopyCertificateButton: React.FC<Props> = ({ name, description, body, enabled, functionDisabled }) => {
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
