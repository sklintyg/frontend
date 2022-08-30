import { CustomButton, Question, QuestionType } from '@frontend/common'
import _ from 'lodash'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import PanelHeaderCustomized from '../../feature/certificate/CertificateSidePanel/PanelHeaderCustomized'
import { getIsSigned } from '../../store/certificate/certificateSelectors'
import {
  getErrorId,
  getIsLoadingQuestions,
  getQuestionDraft,
  getQuestions,
  isCreateQuestionsAvailable,
  isDisplayingCertificateDraft,
} from '../../store/question/questionSelectors'
import FetchQuestionsProblem from '../error/errorPageContent/FetchQuestionsProblem'
import AdministrativeQuestionPanel from './AdministrativeQuestionPanel'
import ComplementQuestionPanel from './ComplementQuestionPanel'
import QuestionPanelFooter from './QuestionPanelFooter'
import { getNumberOfUnhandledQuestions, getShouldComplementedBeActive } from './questionUtils'

const HeaderButtons = styled.div`
  display: flex;
  align-items: stretch;
`

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

interface Props {
  headerHeight: number
}

const QuestionPanel: React.FC<Props> = (props) => {
  const isLoadingQuestions = useSelector(getIsLoadingQuestions)
  return isLoadingQuestions ? null : <QuestionPanelInner {...props} />
}

const QuestionPanelInner: React.FC<Props> = ({ headerHeight }) => {
  const questions = useSelector(getQuestions, _.isEqual)
  const questionDraft = useSelector(getQuestionDraft, _.isEqual)
  const isQuestionFormVisible = useSelector(isCreateQuestionsAvailable)
  const isCertificateDraft = useSelector(isDisplayingCertificateDraft)
  const isSigned = useSelector(getIsSigned())
  const complementQuestions = questions.filter((question) => question.type === QuestionType.COMPLEMENT)
  const administrativeQuestions = questions.filter((question) => question.type !== QuestionType.COMPLEMENT)
  const [isComplementSelected, setIsComplementSelected] = useState(
    getShouldComplementedBeActive(administrativeQuestions, complementQuestions)
  )
  const errorId = useSelector(getErrorId)

  const getButtonNumber = (questions: Question[]) => {
    if (!isSigned) return undefined
    return getNumberOfUnhandledQuestions(questions)
  }

  const getHeaderButtons = () => {
    return (
      <HeaderButtons>
        <CustomButton
          text="Kompletteringsbegäran"
          number={getButtonNumber(complementQuestions)}
          buttonStyle={isComplementSelected ? 'primary' : 'secondary'}
          rounded={true}
          onClick={() => setIsComplementSelected(true)}
          buttonClasses="iu-height-800"
        />
        <CustomButton
          text="Administrativa frågor"
          number={getButtonNumber(administrativeQuestions)}
          buttonStyle={!isComplementSelected ? 'primary' : 'secondary'}
          rounded={true}
          onClick={() => setIsComplementSelected(false)}
          buttonClasses="iu-height-800 iu-ml-300"
        />
      </HeaderButtons>
    )
  }

  const getPanel = () => {
    return (
      <>
        <PanelHeaderCustomized content={getHeaderButtons()} />
        {isComplementSelected ? (
          <ComplementQuestionPanel
            complementQuestions={complementQuestions}
            isDisplayingCertificateDraft={isCertificateDraft}
            headerHeight={headerHeight}
          />
        ) : (
          <AdministrativeQuestionPanel
            administrativeQuestions={administrativeQuestions}
            isQuestionFormVisible={isQuestionFormVisible}
            administrativeQuestionDraft={questionDraft}
            headerHeight={headerHeight}
          />
        )}
        <QuestionPanelFooter questions={questions} />
      </>
    )
  }

  return (
    <Wrapper className="iu-bg-light-grey">
      {errorId ? (
        <>
          <PanelHeaderCustomized content={null} />
          <FetchQuestionsProblem errorId={errorId} />
        </>
      ) : (
        getPanel()
      )}
    </Wrapper>
  )
}

export default QuestionPanel
