import React from 'react'
import { StatusWithIcon, Question, hasUnhandledComplementQuestions } from '@frontend/common'

interface Props {
  questions: Question[]
}

const RevokedStatus: React.FC<Props> = ({ questions }) => {
  if (!hasUnhandledComplementQuestions(questions)) return null

  return <StatusWithIcon>Försäkringskassan har begärt komplettering</StatusWithIcon>
}

export default RevokedStatus
