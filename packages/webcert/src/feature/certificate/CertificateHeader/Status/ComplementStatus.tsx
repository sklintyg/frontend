import React from 'react'
import { StatusWithIcon, Question, hasUnhandledComplementQuestions, CertificateMetadata, isSigned } from '@frontend/common'

const ComplementStatus: React.FC = () => {
  return <StatusWithIcon icon={'ErrorOutlineIcon'}>Försäkringskassan har begärt komplettering</StatusWithIcon>
}

export default ComplementStatus
