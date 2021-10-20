import React, { ReactNode, useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import {
  getQuestionDraft,
  getQuestions,
  isCreateQuestionsAvailable,
  isDisplayingCertificateDraft,
} from '../../store/question/questionSelectors'
import PanelHeaderCustomized from '../../feature/certificate/CertificateSidePanel/PanelHeaderCustomized'
import { CustomButton, QuestionType } from '@frontend/common'
import AdministrativeQuestionPanel from './AdministrativeQuestionPanel'
import ComplementQuestionPanel from './ComplementQuestionPanel'
import QuestionPanelFooter from './QuestionPanelFooter'
import { getNumberOfUnhandledQuestions, getQuestionsOrderedByLastUpdatedAndHandled } from './questionUtils'

const HeaderButtons = styled.div`
  display: flex;
  align-items: stretch;
`

const Wrapper = styled.div`
  background-color: #f7f4f2;
  height: 100%;
  display: flex;
  flex-direction: column;
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
  const isCertificateDraft = useSelector(isDisplayingCertificateDraft)
  const [isComplementSelected, setComplementSelected] = useState(true)

  const complementQuestions = questions.filter((question) => question.type === QuestionType.COMPLEMENT)
  const administrativeQuestions = questions.filter((question) => question.type !== QuestionType.COMPLEMENT)

  const getHeaderButtons = () => {
    return (
      <HeaderButtons>
        <CustomButton
          text={'Kompletteringsbegäran'}
          number={getNumberOfUnhandledQuestions(complementQuestions)}
          buttonStyle={isComplementSelected ? 'primary' : 'secondary'}
          rounded={true}
          onClick={() => setComplementSelected(true)}
          buttonClasses={'iu-height-800'}
        />
        <CustomButton
          text={'Administrativa frågor'}
          number={getNumberOfUnhandledQuestions(administrativeQuestions)}
          buttonStyle={!isComplementSelected ? 'primary' : 'secondary'}
          rounded={true}
          onClick={() => setComplementSelected(false)}
          buttonClasses={'iu-height-800 iu-ml-300'}
        />
      </HeaderButtons>
    )
  }

  return (
    <Wrapper>
      <PanelHeaderCustomized content={getHeaderButtons()} minimizeSidePanel={minimizeSidePanel} />
      {isComplementSelected ? (
        <ComplementQuestionPanel
          complementQuestions={getQuestionsOrderedByLastUpdatedAndHandled(complementQuestions)}
          isDisplayingCertificateDraft={isCertificateDraft}
        />
      ) : (
        <AdministrativeQuestionPanel
          administrativeQuestions={getQuestionsOrderedByLastUpdatedAndHandled(administrativeQuestions)}
          isQuestionFormVisible={isQuestionFormVisible}
          administrativeQuestionDraft={questionDraft}
        />
      )}
      <QuestionPanelFooter questions={questions} />
    </Wrapper>
  )
}

export default QuestionPanel
