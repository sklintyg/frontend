import React, { useEffect, useRef, useState } from 'react'
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

interface StyledProps {
  shouldLimitHeight: boolean
  headerHeight: number
}

const Wrapper = styled.div<StyledProps>`
  height: ${(props) => (props.shouldLimitHeight ? `calc(100% -  ${props.headerHeight}px);` : '100%;')}
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
  const contentRef = useRef(null)
  const [shouldLimitHeight, setShouldLimitHeight] = useState(false)

  useEffect(() => {
    setShouldLimitHeight(contentRef.current ? contentRef.current.scrollHeight > contentRef.current.clientHeight : false)
  }, [contentRef.current])

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
      <Wrapper ref={contentRef} headerHeight={headerHeight} shouldLimitHeight={shouldLimitHeight}>
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
