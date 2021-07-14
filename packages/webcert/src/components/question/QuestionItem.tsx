import React from 'react'
import styled from 'styled-components'
import { Question } from '@frontend/common'
import { format } from 'date-fns'
import fkImg from './fk.png'
import userImage from '../../images/user-image.svg'

// TODO: Replace color with var(--color-grey-400)
const QuestionHeader = styled.div`
  border-bottom: 1px solid #8d8d8d;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Card = styled.div`
  margin: 10px 0 10px 0;
  padding: 10px;
  border-bottom: 10px solid #f7f4f2;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

interface Props {
  question: Question
}

const QuestionItem: React.FC<Props> = ({ question }) => {
  const getImageSrc = () => {
    return question.author === 'Försäkringskassan' ? fkImg : userImage
  }

  return (
    <Card className={'ic-card'}>
      <QuestionHeader>
        <img src={getImageSrc()} className={'iu-mr-200'} />
        <div className={'iu-fullwidth iu-pl-300 iu-fs-200'}>
          <Wrapper>
            <p className={'iu-fw-heading'}>{question.author}</p>
          </Wrapper>
          <Wrapper>
            <p className={'iu-fw-heading'}>{question.subject}</p>
            <p className={'iu-color-grey-400 iu-m-none'}>{format(new Date(question.sent), 'yyyy-MM-dd HH:mm')}</p>
          </Wrapper>
        </div>
      </QuestionHeader>
      <p>{question.message}</p>
    </Card>
  )
}

export default QuestionItem
