import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { getQuestions } from '../../store/question/questionSelectors'
import QuestionItem from './QuestionItem'
import PanelHeaderCustomized from '../../feature/certificate/CertificateSidePanel/PanelHeaderCustomized'
import { CustomButton, ImageCentered } from '@frontend/common'
import noQuestionsImg from './fragor_svar_nodata.svg'

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
        style={'primary'}
        rounded={true}
      />
    )
  }

  const getNoQuestionsMessage = () => {
    return (
      <ImageCentered imgSrc={noQuestionsImg} alt={'Inga frågor'}>
        <p>Det finns inga administrativa frågor för detta intyg.</p>
      </ImageCentered>
    )
  }

  return (
    <Wrapper>
      <PanelHeaderCustomized content={getHeaderButtons()} minimizeSidePanel={minimizeSidePanel} />
      <QuestionWrapper className={'iu-bg-white'}>
        {questions && questions.map((question) => <QuestionItem key={question.id} question={question} />)}
        {questions && questions.length === 0 && getNoQuestionsMessage()}
      </QuestionWrapper>
    </Wrapper>
  )
}

export default QuestionPanel
