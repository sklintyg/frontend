import React from 'react'
import { ImageCentered, Question } from '@frontend/common'
import QuestionForm from './QuestionForm'
import QuestionItem from './QuestionItem'
import noQuestionsImg from './fragor_svar_nodata.svg'
import styled from 'styled-components'
import { getQuestionsOrderedByLastUpdatedAndHandled } from './questionUtils'

const Root = styled.div`
  overflow-y: auto;
  height: 100%;
`

const Wrapper = styled.div`
  height: calc(100% - 55px);
  overflow-y: auto;
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
      <Wrapper>
        {isQuestionFormVisible && <QuestionForm questionDraft={administrativeQuestionDraft} />}
        <div className={'iu-bg-light-grey'}>
          {getQuestionsOrderedByLastUpdatedAndHandled(administrativeQuestions).map((administrativeQuestion) => (
            <QuestionItem key={administrativeQuestion.id} question={administrativeQuestion} />
          ))}
          {administrativeQuestions.length === 0 && getNoQuestionsMessage()}
        </div>
      </Wrapper>
    </Root>
  )
}

export default AdministrativeQuestionPanel
