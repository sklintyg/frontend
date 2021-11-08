import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import {
  getQuestionDraft,
  getQuestions,
  isCreateQuestionsAvailable,
  isDisplayingCertificateDraft,
} from '../../store/question/questionSelectors'
import PanelHeaderCustomized from '../../feature/certificate/CertificateSidePanel/PanelHeaderCustomized'
import { CustomButton, Question, QuestionType } from '@frontend/common'
import AdministrativeQuestionPanel from './AdministrativeQuestionPanel'
import ComplementQuestionPanel from './ComplementQuestionPanel'
import QuestionPanelFooter from './QuestionPanelFooter'
import { getShouldComplementedBeActive, getNumberOfUnhandledQuestions } from './questionUtils'
import usePrevious from '../../hooks/usePrevious'
import { getIsSigned } from '../../store/certificate/certificateSelectors'

const HeaderButtons = styled.div`
  display: flex;
  align-items: stretch;
`

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const QuestionPanel: React.FC = () => {
  const questions = useSelector(getQuestions)
  const questionDraft = useSelector(getQuestionDraft)
  const isQuestionFormVisible = useSelector(isCreateQuestionsAvailable)
  const isCertificateDraft = useSelector(isDisplayingCertificateDraft)
  const isSigned = useSelector(getIsSigned())
  const [isComplementSelected, setIsComplementSelected] = useState(true)

  const complementQuestions = questions.filter((question) => question.type === QuestionType.COMPLEMENT)
  const administrativeQuestions = questions.filter((question) => question.type !== QuestionType.COMPLEMENT)

  const previousQuestionsLength = usePrevious(administrativeQuestions.length)

  useEffect(() => {
    if (previousQuestionsLength !== 0 || (previousQuestionsLength.length > 0 && administrativeQuestions.length > previousQuestionsLength))
      return
    setIsComplementSelected(getShouldComplementedBeActive(administrativeQuestions, complementQuestions))
  }, [administrativeQuestions.length, previousQuestionsLength])

  const getButtonNumber = (questions: Question[]) => {
    if (!isSigned) return undefined
    return getNumberOfUnhandledQuestions(questions)
  }

  const getHeaderButtons = () => {
    return (
      <HeaderButtons>
        <CustomButton
          text={'Kompletteringsbegäran'}
          number={getButtonNumber(complementQuestions)}
          buttonStyle={isComplementSelected ? 'primary' : 'secondary'}
          rounded={true}
          onClick={() => setIsComplementSelected(true)}
          buttonClasses={'iu-height-800'}
        />
        <CustomButton
          text={'Administrativa frågor'}
          number={getButtonNumber(administrativeQuestions)}
          buttonStyle={!isComplementSelected ? 'primary' : 'secondary'}
          rounded={true}
          onClick={() => setIsComplementSelected(false)}
          buttonClasses={'iu-height-800 iu-ml-300'}
        />
      </HeaderButtons>
    )
  }

  return (
    <Wrapper className={'iu-bg-light-grey'}>
      <PanelHeaderCustomized content={getHeaderButtons()} />
      {isComplementSelected ? (
        <ComplementQuestionPanel complementQuestions={complementQuestions} isDisplayingCertificateDraft={isCertificateDraft} />
      ) : (
        <AdministrativeQuestionPanel
          administrativeQuestions={administrativeQuestions}
          isQuestionFormVisible={isQuestionFormVisible}
          administrativeQuestionDraft={questionDraft}
        />
      )}
      <QuestionPanelFooter questions={questions} />
    </Wrapper>
  )
}

export default QuestionPanel
