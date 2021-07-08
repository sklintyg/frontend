import React from 'react'
import styled from 'styled-components'
import { Question } from '@frontend/common'
import { format } from 'date-fns'

// TODO: Replace color with var(--color-grey-400)
const QuestionHeader = styled.div`
  border-bottom: 1px solid #8d8d8d;
  display: flex;
  justify-content: space-between;
`

const Card = styled.div`
  margin: 10px 0 10px 0;
  padding: 10px;
`

interface Props {
  question: Question
}

const QuestionItem: React.FC<Props> = ({ question }) => {
  return (
    <Card className={'ic-card'}>
      <QuestionHeader>
        <div>
          <p>{question.author}</p>
          <p className={'iu-fw-heading'}>{question.subject}</p>
        </div>
        <div>
          <p className={'iu-color-grey-400'}>{format(new Date(question.sent), 'yyyy-MM-dd HH:mm')}</p>
        </div>
      </QuestionHeader>
      <p>{question.message}</p>
    </Card>
  )
}

export default QuestionItem
