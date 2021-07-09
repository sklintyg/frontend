import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { getQuestions } from '../../store/question/questionSelectors'
import QuestionItem from './QuestionItem'
import PanelHeaderCustomized from '../../feature/certificate/CertificateSidePanel/PanelHeaderCustomized'
import { CustomButton } from '@frontend/common/src'

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  height: 100%;
  overflow-y: 100%;
`

const QuestionWrapper = styled.div`
  height: 100%;
  overflow-y: auto;
`

const Wrapper = styled.div`
  background-color: #f7f4f2;
  height: 100%;
`

interface Props {
  tabIndex: number
  selectedTabIndex: number
  minimizeSidePanel: ReactNode
}

const QuestionPanel: React.FC<Props> = ({ minimizeSidePanel }) => {
  const questions = useSelector(getQuestions)

  const getHeaderButtons = () => {
    return (
      <CustomButton
        text={'Administrativa frågor'}
        number={questions.length > 0 ? questions.length : undefined}
        rounded={true}></CustomButton>
    )
  }

  const getNoQuestionsMessage = () => {
    return <EmptyWrapper>Det finns inga administrativa frågor för detta intyg.</EmptyWrapper>
  }

  return (
    <Wrapper>
      <PanelHeaderCustomized content={getHeaderButtons()} minimizeSidePanel={minimizeSidePanel} />
      <QuestionWrapper>
        {questions && questions.map((question) => <QuestionItem key={question.id} question={question}></QuestionItem>)}
        {questions && questions.length === 0 && getNoQuestionsMessage()}
      </QuestionWrapper>
    </Wrapper>
  )
}

export default QuestionPanel
