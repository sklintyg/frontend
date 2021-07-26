import React from 'react'
import { ImageCentered, Question } from '@frontend/common'
import QuestionItem from './QuestionItem'
import noQuestionsImg from './fragor_svar_nodata.svg'
import styled from 'styled-components'

const Root = styled.div`
  height: 100%;
  overflow-y: auto;
`

interface Props {
  complementQuestions: Question[]
}

const ComplementQuestionPanel: React.FC<Props> = ({ complementQuestions }) => {
  const getNoQuestionsMessage = () => {
    return (
      <div>
        <ImageCentered imgSrc={noQuestionsImg} alt={'Inga frågor'}>
          <p>Det finns ingen kompletteringsbegäran på detta intyg.</p>
        </ImageCentered>
      </div>
    )
  }

  return (
    <Root>
      <div className={'iu-bg-white'}>
        {complementQuestions.map((complementQuestion) => (
          <QuestionItem key={complementQuestion.id} question={complementQuestion} />
        ))}
        {complementQuestions && complementQuestions.length === 0 && getNoQuestionsMessage()}
      </div>
    </Root>
  )
}

export default ComplementQuestionPanel
