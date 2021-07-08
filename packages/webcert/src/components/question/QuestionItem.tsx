import React from 'react'
import styled from 'styled-components'
import { Question } from '@frontend/common'

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  height: 100%;
  overflow-y: 100%;
`

interface Props {
  question: Question
}

const QuestionItem: React.FC<Props> = ({ question }) => {
  return (
    <div className={'ic-card'}>
      <p>{question.author}</p>
      <h5>{question.subject}</h5>
      <p>{question.sent}</p>
      <p>{question.message}</p>
    </div>
  )
}

export default QuestionItem
