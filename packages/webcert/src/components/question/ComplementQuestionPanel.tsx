import { CertificateStatus, ImageCentered, InfoBox, noQuestionImage, Question, Spinner } from '@frontend/common'
import React, { useCallback, useState } from 'react'
import QuestionItem from './QuestionItem'

import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { getIsLoadingQuestions } from '../../store/question/questionSelectors'
import { getQuestionsOrderedByLastUpdatedAndHandled } from './questionUtils'

const Root = styled.div`
  height: 100%;
  overflow-y: auto;
`

interface StyledProps {
  shouldLimitHeight: boolean
  headerHeight: number
}

const Wrapper = styled.div<StyledProps>`
  height: ${(props) => (props.shouldLimitHeight ? `calc(100% -  ${props.headerHeight}px);` : '100%;')};
  background-color: white;
  overflow-y: auto;

  > *:not(:last-child) {
    border-bottom: 10px solid #f7f4f2;
  }
`

interface Props {
  complementQuestions: Question[]
  isDisplayingCertificateDraft: boolean
  headerHeight: number
}

const ComplementQuestionPanel: React.FC<Props> = ({ complementQuestions, isDisplayingCertificateDraft, headerHeight }) => {
  const [shouldLimitHeight, setShouldLimitHeight] = useState(false)
  const isLoadingQuestions = useSelector(getIsLoadingQuestions)

  const contentRef = useCallback((node: HTMLDivElement) => {
    setShouldLimitHeight(node ? node.scrollHeight > node.clientHeight : false)
  }, [])

  const getNoQuestionsMessage = () => {
    return (
      <div>
        <ImageCentered imgSrc={noQuestionImage} alt={'Inga frågor'}>
          <p>Det finns ingen kompletteringsbegäran på detta intyg.</p>
        </ImageCentered>
      </div>
    )
  }

  const getContinueOnDraft = () => {
    const question = complementQuestions.find(
      (complementQuestion) =>
        complementQuestion.answeredByCertificate && complementQuestion.answeredByCertificate.status === CertificateStatus.UNSIGNED
    )

    if (question === undefined) {
      return null
    }

    return (
      <div className={'iu-p-300'}>
        <InfoBox type={'info'}>
          <p>
            Det finns redan en påbörjad komplettering.{' '}
            <Link to={`/certificate/${question.answeredByCertificate?.certificateId}`}>Öppna utkastet</Link>
          </p>
        </InfoBox>
      </div>
    )
  }

  return (
    <Root>
      <Wrapper ref={contentRef} headerHeight={headerHeight} shouldLimitHeight={shouldLimitHeight}>
        {isLoadingQuestions ? (
          <Spinner className="iu-m-500" />
        ) : (
          <>
            {!isDisplayingCertificateDraft && getContinueOnDraft()}
            {getQuestionsOrderedByLastUpdatedAndHandled(complementQuestions).map((complementQuestion) => (
              <QuestionItem key={complementQuestion.id} question={complementQuestion} />
            ))}
            {complementQuestions && complementQuestions.length === 0 && getNoQuestionsMessage()}
          </>
        )}
      </Wrapper>
    </Root>
  )
}

export default ComplementQuestionPanel
