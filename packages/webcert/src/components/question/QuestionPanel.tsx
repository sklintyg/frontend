import React, { ReactNode } from 'react'
import PanelHeader from '../../feature/certificate/CertificateSidePanel/PanelHeader'
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

interface Props {
  tabIndex: number
  selectedTabIndex: number
  minimizeSidePanel: ReactNode
}

const QuestionPanel: React.FC<Props> = ({ minimizeSidePanel }) => {
  const questions = useSelector(getQuestions)

  const getHeaderButtons = () => {
    return (
      <CustomButton text={questions.length === 0 ? 'Administrativa frågor' : `Administrativa frågor ${questions.length}`}></CustomButton>
    )
  }

  const getNoQuestionsMessage = () => {
    return <EmptyWrapper>Det finns inga administrativa frågor för detta intyg.</EmptyWrapper>
  }

  return (
    <>
      <PanelHeaderCustomized content={getHeaderButtons()} minimizeSidePanel={minimizeSidePanel} />
      {questions && questions.map((question) => <QuestionItem key={question.id} question={question}></QuestionItem>)}
      {questions && questions.length === 0 && getNoQuestionsMessage()}
    </>
  )
}

export default QuestionPanel
