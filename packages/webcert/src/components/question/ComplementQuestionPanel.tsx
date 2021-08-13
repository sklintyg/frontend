import React from 'react'
import { CertificateStatus, ImageCentered, InfoBox, Question } from '@frontend/common'
import QuestionItem from './QuestionItem'
import noQuestionsImg from './fragor_svar_nodata.svg'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Root = styled.div`
  height: 100%;
  overflow-y: auto;
`

interface Props {
  complementQuestions: Question[]
  isDisplayingCertificateDraft: boolean
}

const ComplementQuestionPanel: React.FC<Props> = ({ complementQuestions, isDisplayingCertificateDraft }) => {
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

    if (question == undefined) {
      return null
    }

    return (
      <div className={'iu-p-300'}>
        <InfoBox type={'info'}>
          Det finns redan en påbörjad komplettering.
          <Link to={`/certificate/${question.answeredByCertificate?.certificateId}`}>Öppna utkastet</Link>
        </InfoBox>
      </div>
    )
  }

  return (
    <Root>
      <div className={'iu-bg-white'}>
        {!isDisplayingCertificateDraft && getContinueOnDraft()}
        {complementQuestions.map((complementQuestion) => (
          <QuestionItem key={complementQuestion.id} question={complementQuestion} />
        ))}
        {complementQuestions && complementQuestions.length === 0 && getNoQuestionsMessage()}
      </div>
    </Root>
  )
}

export default ComplementQuestionPanel
