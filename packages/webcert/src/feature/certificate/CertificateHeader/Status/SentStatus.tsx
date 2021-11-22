import React from 'react'
import {
  CertificateMetadata,
  hasUnhandledComplementQuestions,
  getComplementedByCertificateEvent,
  isReplaced,
  isSigned,
  Question,
  StatusWithIcon,
  CertificateEvent,
} from '@frontend/common'

interface Props {
  certificateMetadata: CertificateMetadata
  questions: Question[]
  historyEntries: CertificateEvent[]
}

const SentStatus: React.FC<Props> = ({ certificateMetadata, questions, historyEntries }) => {
  if (
    !isSigned(certificateMetadata) ||
    isReplaced(certificateMetadata) ||
    !certificateMetadata.sent ||
    hasUnhandledComplementQuestions(questions) ||
    getComplementedByCertificateEvent(historyEntries)
  )
    return null

  //TODO: Replace this with recipient from backend
  return (
    <StatusWithIcon icon={'CheckIcon'}>
      Intyget är skickat till {certificateMetadata.type === 'lisjp' ? 'Försäkringskassan' : 'Arbetsförmedlingen'}
    </StatusWithIcon>
  )
}

export default SentStatus
