import { isEqual } from 'lodash-es'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import PanelHeaderCustomized from '../../feature/certificate/CertificateSidePanel/PanelHeaderCustomized'
import { getCertificateResourceLink, getIsSigned } from '../../store/certificate/certificateSelectors'
import {
  getErrorId,
  getIsLoadingQuestions,
  getQuestionDraft,
  getQuestions,
  isCreateQuestionsAvailable,
  isDisplayingCertificateDraft,
} from '../../store/question/questionSelectors'
import { useAppSelector } from '../../store/store'
import { Question, QuestionType, ResourceLinkType } from '../../types'
import { CustomButton } from '../Inputs/CustomButton'
import FetchQuestionsProblem from '../error/errorPageContent/FetchQuestionsProblem'
import AdministrativeQuestionPanel from './AdministrativeQuestionPanel'
import ComplementQuestionPanel from './ComplementQuestionPanel'
import { QuestionPanelFooter } from './QuestionPanelFooter/QuestionPanelFooter'
import { getNumberOfUnhandledQuestions, getShouldComplementedBeActive } from './questionUtils'

const HeaderButtons = styled.div`
  display: flex;
  align-items: stretch;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
`

const Content = styled.div`
  overflow-y: auto;
  flex-grow: 1;
`

const QuestionPanel: React.FC = () => {
  const isLoadingQuestions = useSelector(getIsLoadingQuestions)
  return isLoadingQuestions ? null : <QuestionPanelInner />
}

const QuestionPanelInner: React.FC = () => {
  const isCertificateDraft = useAppSelector(isDisplayingCertificateDraft)
  const isQuestionFormVisible = useAppSelector(isCreateQuestionsAvailable)
  const isSigned = useAppSelector(getIsSigned())
  const questionAdministrative = useAppSelector(getCertificateResourceLink(ResourceLinkType.QUESTIONS_ADMINISTRATIVE))
  const questionDraft = useAppSelector(getQuestionDraft, isEqual)
  const questions = useAppSelector(getQuestions, isEqual)
  const complementQuestions = questions.filter((question) => question.type === QuestionType.COMPLEMENT)
  const administrativeQuestions = questions.filter((question) => question.type !== QuestionType.COMPLEMENT)
  const [isComplementSelected, setIsComplementSelected] = useState(
    getShouldComplementedBeActive(administrativeQuestions, complementQuestions) ||
      (questionAdministrative && questionAdministrative.enabled === false)
  )
  const errorId = useSelector(getErrorId)

  const getButtonNumber = (questions: Question[]) => {
    if (!isSigned) return undefined
    return getNumberOfUnhandledQuestions(questions)
  }
  return (
    <Wrapper className="iu-bg-light-grey">
      {errorId ? (
        <>
          <PanelHeaderCustomized content={null} />
          <FetchQuestionsProblem errorId={errorId} />
        </>
      ) : (
        <>
          <PanelHeaderCustomized
            content={
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
                  disabled={questionAdministrative && questionAdministrative.enabled === false}
                  tooltip={questionAdministrative?.description}
                  rounded={true}
                  onClick={() => setIsComplementSelected(false)}
                  buttonClasses="iu-height-800 iu-ml-300"
                />
              </HeaderButtons>
            }
          />
          <Content>
            {isComplementSelected ? (
              <ComplementQuestionPanel complementQuestions={complementQuestions} isDisplayingCertificateDraft={isCertificateDraft} />
            ) : (
              <AdministrativeQuestionPanel
                administrativeQuestions={administrativeQuestions}
                isQuestionFormVisible={isQuestionFormVisible}
                administrativeQuestionDraft={questionDraft}
              />
            )}
          </Content>
          <QuestionPanelFooter questions={questions} />
        </>
      )}
    </Wrapper>
  )
}

export default QuestionPanel
