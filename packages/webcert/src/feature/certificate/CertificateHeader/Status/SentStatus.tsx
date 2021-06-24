import React from 'react'
import { CertificateMetadata, isReplaced, isSigned, StatusWithIcon } from '@frontend/common'

interface Props {
  certificateMetadata: CertificateMetadata
}

const SentStatus: React.FC<Props> = ({ certificateMetadata }) => {
  if (!isSigned(certificateMetadata) || isReplaced(certificateMetadata) || !certificateMetadata.sent) return null

  //TODO: Replace this with recipient from backend
  return (
    <StatusWithIcon icon={'CheckIcon'}>
      Intyget är skickat till {certificateMetadata.type === 'lisjp' ? 'Försäkringskassan' : 'Arbetsförmedlingen'}
    </StatusWithIcon>
  )
}

export default SentStatus
