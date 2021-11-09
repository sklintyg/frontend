import React from 'react'
import { StatusWithIcon, Question, hasUnhandledComplementQuestions, CertificateMetadata, isSigned } from '@frontend/common'

interface Props {
  questions: Question[]
  certificateMetadata: CertificateMetadata
}

const RevokedStatus: React.FC<Props> = ({ questions, certificateMetadata }) => {
  if (!hasUnhandledComplementQuestions(questions) || !isSigned(certificateMetadata)) return null

  return <StatusWithIcon icon={'ErrorOutlineIcon'}>Försäkringskassan har begärt komplettering</StatusWithIcon>
}

export default RevokedStatus
