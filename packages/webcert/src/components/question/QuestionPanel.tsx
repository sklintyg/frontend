import { CertificateStatus, CustomButton, Question, QuestionType } from '@frontend/common'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import PanelHeaderCustomized from '../../feature/certificate/CertificateSidePanel/PanelHeaderCustomized'
import { useGetQuestionsQuery } from '../../store/api'
import { getCertificateMetaData, getIsCreateQuestionsAvailable, getIsSigned } from '../../store/certificate/certificateSelectors'
import { throwError } from '../../store/error/errorActions'
import { createErrorRequestWithErrorId } from '../../store/error/errorCreator'
import { ErrorCode, ErrorType } from '../../store/error/errorReducer'
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
  certificateId: string
}

const QuestionPanel: React.FC<Props> = (props) => {
  const { isLoading, isUninitialized } = useGetQuestionsQuery(props.certificateId)
  return isLoading || isUninitialized ? null : <QuestionPanelInner {...props} />
}

const QuestionPanelInner: React.FC<Props> = ({ headerHeight, certificateId }) => {
  const dispatch = useDispatch()
  const { data, isLoading, isError } = useGetQuestionsQuery(certificateId)
  const certificateMetadata = useSelector(getCertificateMetaData)
  const questions = (data || []).filter(({ sent }) => sent)
  const questionDraft = (data || []).find(({ sent }) => !sent)
  const isQuestionFormVisible = useSelector(getIsCreateQuestionsAvailable)
  const isCertificateDraft = certificateMetadata?.status === CertificateStatus.UNSIGNED
  const isSigned = useSelector(getIsSigned())
  const complementQuestions = questions.filter((question) => question.type === QuestionType.COMPLEMENT)
  const administrativeQuestions = questions.filter((question) => question.type !== QuestionType.COMPLEMENT)
  const [isComplementSelected, setIsComplementSelected] = useState(
    getShouldComplementedBeActive(administrativeQuestions, complementQuestions)
  )

  const errorRequest = useMemo(() => createErrorRequestWithErrorId(ErrorType.SILENT, ErrorCode.FETCH_QUESTIONS_PROBLEM, certificateId), [
    certificateId,
  ])

  const errorId = errorRequest.errorId ?? ''

  useEffect(() => {
    if (isError) {
      dispatch(throwError(errorRequest))
    }
  }, [dispatch, errorRequest, isError])

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
            isLoadingQuestions={isLoading}
          />
        ) : (
          <AdministrativeQuestionPanel
            administrativeQuestions={administrativeQuestions}
            isQuestionFormVisible={isQuestionFormVisible}
            administrativeQuestionDraft={questionDraft}
            headerHeight={headerHeight}
            isLoadingQuestions={isLoading}
          />
        )}
        <QuestionPanelFooter questions={questions} />
      </>
    )
  }

  return (
    <Wrapper className="iu-bg-light-grey">
      {isError ? (
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
