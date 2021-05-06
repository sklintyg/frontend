import React from 'react'
import { CertificateMetadata, isReplaced, isSigned, StatusWithIcon } from '@frontend/common'
import { CertificateEvent, CertificateEventType } from '@frontend/common/src'

interface Props {
  certificateMetadata: CertificateMetadata
  certificateEvents: CertificateEvent[]
}

const SentStatus: React.FC<Props> = ({ certificateMetadata, certificateEvents }) => {
  const isSent = certificateEvents.some((e) => e.type === CertificateEventType.SENT)
  if (!isSigned(certificateMetadata) || isReplaced(certificateMetadata) || !isSent) return null

  //TODO: Replace this with recipient from backend
  return (
    <StatusWithIcon icon={'CheckIcon'}>
      Intyget är skickat till {certificateMetadata.type === 'lisjp' ? 'Försäkringskassan' : 'Arbetsförmedlingen'}
    </StatusWithIcon>
  )
}

export default SentStatus
