import React from 'react'
import { CertificateMetadata, isReplaced, isSigned, StatusWithIcon, CertificateEvent, isSent } from '@frontend/common'

interface Props {
  certificateMetadata: CertificateMetadata
  certificateEvents: CertificateEvent[]
}

const SentStatus: React.FC<Props> = ({ certificateMetadata, certificateEvents }) => {
  if (!isSigned(certificateMetadata) || isReplaced(certificateMetadata) || !isSent(certificateEvents)) return null

  //TODO: Replace this with recipient from backend
  return (
    <StatusWithIcon icon={'CheckIcon'}>
      Intyget är skickat till {certificateMetadata.type === 'lisjp' ? 'Försäkringskassan' : 'Arbetsförmedlingen'}
    </StatusWithIcon>
  )
}

export default SentStatus
