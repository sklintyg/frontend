import React, { useEffect, useRef, useState } from 'react'
import { CertificateStatus, ImageCentered, InfoBox, Question } from '@frontend/common'
import QuestionItem from './QuestionItem'
import noQuestionsImg from './fragor_svar_nodata.svg'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
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
  height: ${(props) => (props.shouldLimitHeight ? `calc(100% -  ${props.headerHeight}px);` : '100%;')}
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
  const contentRef = useRef(null)
  const [shouldLimitHeight, setShouldLimitHeight] = useState(false)

  useEffect(() => {
    setShouldLimitHeight(contentRef.current ? contentRef.current.scrollHeight > contentRef.current.clientHeight : false)
  }, [contentRef.current])

  const getNoQuestionsMessage = () => {
    return (
      <div>
        <ImageCentered imgSrc={noQuestionsImg} alt={'Inga frågor'}>
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
        {!isDisplayingCertificateDraft && getContinueOnDraft()}
        {getQuestionsOrderedByLastUpdatedAndHandled(complementQuestions).map((complementQuestion) => (
          <QuestionItem key={complementQuestion.id} question={complementQuestion} />
        ))}
        {complementQuestions && complementQuestions.length === 0 && getNoQuestionsMessage()}
      </Wrapper>
    </Root>
  )
}

export default ComplementQuestionPanel
