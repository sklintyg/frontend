import { ImageCentered, noQuestionImage, Question, Spinner } from '@frontend/common'
import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { getIsLoadingQuestions } from '../../store/question/questionSelectors'
import QuestionForm from './QuestionForm'
import QuestionItem from './QuestionItem'
import { getQuestionsOrderedByLastUpdatedAndHandled } from './questionUtils'

const Root = styled.div`
  overflow-y: auto;
  height: 100%;
`

interface StyledProps {
  shouldLimitHeight: boolean
  headerHeight: number
}

const Wrapper = styled.div<StyledProps>`
  height: ${(props) => (props.shouldLimitHeight ? `calc(100% -  ${props.headerHeight}px);` : '100%;')};
  overflow-y: auto;
`

interface Props {
  administrativeQuestions: Question[]
  isQuestionFormVisible: boolean
  administrativeQuestionDraft: Question
  headerHeight: number
}

const AdministrativeQuestionPanel: React.FC<Props> = ({
  administrativeQuestions,
  isQuestionFormVisible,
  administrativeQuestionDraft,
  headerHeight,
}) => {
  const [shouldLimitHeight, setShouldLimitHeight] = useState(false)
  const isLoadingQuestions = useSelector(getIsLoadingQuestions)

  const contentRef = useCallback((node: HTMLDivElement) => {
    setShouldLimitHeight(node ? node.scrollHeight > node.clientHeight : false)
  }, [])

  const getNoQuestionsMessage = () => {
    return (
      <div className={isQuestionFormVisible ? 'iu-mt-300' : ''}>
        <ImageCentered imgSrc={noQuestionImage} alt={'Inga frågor'}>
          <p>Det finns inga administrativa frågor för detta intyg.</p>
        </ImageCentered>
      </div>
    )
  }

  return (
    <Root>
      <Wrapper ref={contentRef} headerHeight={headerHeight} shouldLimitHeight={shouldLimitHeight}>
        {isQuestionFormVisible && <QuestionForm questionDraft={administrativeQuestionDraft} />}
        {isLoadingQuestions && <Spinner className="iu-m-500" />}
        <div className={'iu-bg-light-grey'}>
          {getQuestionsOrderedByLastUpdatedAndHandled(administrativeQuestions).map((administrativeQuestion) => (
            <QuestionItem key={administrativeQuestion.id} question={administrativeQuestion} />
          ))}
          {!isLoadingQuestions && administrativeQuestions.length === 0 && getNoQuestionsMessage()}
        </div>
      </Wrapper>
    </Root>
  )
}

export default AdministrativeQuestionPanel
