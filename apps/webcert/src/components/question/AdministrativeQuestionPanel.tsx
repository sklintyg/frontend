import type React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { noQuestionImage } from '../../images'
import { getIsLoadingQuestions } from '../../store/question/questionSelectors'
import type { Question } from '../../types'
import ImageCentered from '../image/image/ImageCentered'
import Spinner from '../utils/Spinner'
import QuestionForm from './QuestionForm'
import QuestionItem from './QuestionItem'
import { getQuestionsOrderedByLastUpdatedAndHandled } from './questionUtils'

const Root = styled.div`
  overflow-y: auto;
  height: 100%;
`

const Wrapper = styled.div`
  overflow-y: auto;

  > *:last-child {
    padding-bottom: 50px;
  }
`

interface Props {
  administrativeQuestions: Question[]
  isQuestionFormVisible: boolean
  administrativeQuestionDraft: Question
}

const AdministrativeQuestionPanel = ({ administrativeQuestions, isQuestionFormVisible, administrativeQuestionDraft }: Props) => {
  const isLoadingQuestions = useSelector(getIsLoadingQuestions)

  return (
    <Root>
      <Wrapper>
        {isQuestionFormVisible && <QuestionForm questionDraft={administrativeQuestionDraft} />}
        {isLoadingQuestions && <Spinner className="iu-m-500" />}
        <div className={'iu-bg-light-grey'}>
          {getQuestionsOrderedByLastUpdatedAndHandled(administrativeQuestions).map((administrativeQuestion) => (
            <QuestionItem key={administrativeQuestion.id} question={administrativeQuestion} />
          ))}
          {!isLoadingQuestions && administrativeQuestions.length === 0 && (
            <div className={isQuestionFormVisible ? 'iu-mt-300' : ''}>
              <ImageCentered imgSrc={noQuestionImage} alt={'Inga frågor'}>
                <p>Det finns inga administrativa frågor för detta intyg.</p>
              </ImageCentered>
            </div>
          )}
        </div>
      </Wrapper>
    </Root>
  )
}

export default AdministrativeQuestionPanel
