import React from 'react'
import { CertificateMetadata, hasUnhandledComplementQuestions, isReplaced, isSigned, Question, StatusWithIcon } from '@frontend/common'

interface Props {
  certificateMetadata: CertificateMetadata
  questions: Question[]
}

const SentStatus: React.FC<Props> = ({ certificateMetadata, questions }) => {
  if (
    !isSigned(certificateMetadata) ||
    isReplaced(certificateMetadata) ||
    !certificateMetadata.sent ||
    hasUnhandledComplementQuestions(questions)
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
