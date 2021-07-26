import React, { ReactNode, useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { getQuestionDraft, getQuestions, isCreateQuestionsAvailable } from '../../store/question/questionSelectors'
import PanelHeaderCustomized from '../../feature/certificate/CertificateSidePanel/PanelHeaderCustomized'
import { CustomButton, QuestionType } from '@frontend/common'
import AdministrativeQuestionPanel from './AdministrativeQuestionPanel'
import ComplementQuestionPanel from './ComplementQuestionPanel'

const HeaderButtons = styled.div`
  display: flex;
  align-items: stretch;
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
  const questionDraft = useSelector(getQuestionDraft)
  const isQuestionFormVisible = useSelector(isCreateQuestionsAvailable)
  const [isComplementSelected, setComplementSelected] = useState(true)

  const complementQuestions = questions.filter((question) => question.type === QuestionType.COMPLEMENT)
  const administrativeQuestions = questions.filter((question) => question.type !== QuestionType.COMPLEMENT)

  const getHeaderButtons = () => {
    return (
      <HeaderButtons>
        <CustomButton
          text={'Kompletteringsbegäran'}
          number={complementQuestions.length > 0 ? complementQuestions.length : undefined}
          buttonStyle={'primary'}
          rounded={true}
          onClick={() => setComplementSelected(true)}
        />
        <CustomButton
          text={'Administrativa frågor'}
          number={administrativeQuestions.length > 0 ? administrativeQuestions.length : undefined}
          buttonStyle={'primary'}
          rounded={true}
          onClick={() => setComplementSelected(false)}
        />
      </HeaderButtons>
    )
  }

  return (
    <Wrapper>
      <PanelHeaderCustomized content={getHeaderButtons()} minimizeSidePanel={minimizeSidePanel} />
      {isComplementSelected ? (
        <ComplementQuestionPanel complementQuestions={complementQuestions} />
      ) : (
        <AdministrativeQuestionPanel
          administrativeQuestions={administrativeQuestions}
          isQuestionFormVisible={isQuestionFormVisible}
          administrativeQuestionDraft={questionDraft}
        />
      )}
    </Wrapper>
  )
}

export default QuestionPanel
