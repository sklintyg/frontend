import React from 'react'
import { ImageCentered, Question } from '@frontend/common'
import QuestionForm from './QuestionForm'
import QuestionItem from './QuestionItem'
import noQuestionsImg from './fragor_svar_nodata.svg'
import styled from 'styled-components'
import { getQuestionsOrderedByLastUpdatedAndHandled } from './questionUtils'

const Root = styled.div`
  overflow-y: auto;
  height: calc(100% - 136px);
`

interface Props {
  administrativeQuestions: Question[]
  isQuestionFormVisible: boolean
  administrativeQuestionDraft: Question
}

const AdministrativeQuestionPanel: React.FC<Props> = ({ administrativeQuestions, isQuestionFormVisible, administrativeQuestionDraft }) => {
  const getNoQuestionsMessage = () => {
    return (
      <div className={isQuestionFormVisible ? 'iu-mt-300' : ''}>
        <ImageCentered imgSrc={noQuestionsImg} alt={'Inga frågor'}>
          <p>Det finns inga administrativa frågor för detta intyg.</p>
        </ImageCentered>
      </div>
    )
  }

  return (
    <Root>
      {isQuestionFormVisible && <QuestionForm questionDraft={administrativeQuestionDraft} />}
      <div className={'iu-bg-light-grey'}>
        {getQuestionsOrderedByLastUpdatedAndHandled(administrativeQuestions).map((administrativeQuestion) => (
          <QuestionItem key={administrativeQuestion.id} question={administrativeQuestion} />
        ))}
        {administrativeQuestions.length === 0 && getNoQuestionsMessage()}
      </div>
    </Root>
  )
}

export default AdministrativeQuestionPanel
