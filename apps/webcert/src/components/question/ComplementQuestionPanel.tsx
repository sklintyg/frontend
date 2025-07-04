import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { noQuestionImage } from '../../images'
import { getIsLoadingQuestions } from '../../store/question/questionSelectors'
import type { Question } from '../../types'
import { CertificateStatus } from '../../types'
import ImageCentered from '../image/image/ImageCentered'
import InfoBox from '../utils/InfoBox'
import Spinner from '../utils/Spinner'
import QuestionItem from './QuestionItem'
import { getQuestionsOrderedByLastUpdatedAndHandled } from './questionUtils'

const Wrapper = styled.div`
  background-color: white;
  overflow-y: auto;

  > *:not(:last-child) {
    border-bottom: 10px solid #f7f4f2;
  }

  > *:last-child {
    padding-bottom: 50px;
  }
`

interface Props {
  complementQuestions: Question[]
  isDisplayingCertificateDraft: boolean
}

const ComplementQuestionPanel = ({ complementQuestions, isDisplayingCertificateDraft }: Props) => {
  const isLoadingQuestions = useSelector(getIsLoadingQuestions)

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
    <Wrapper>
      {isLoadingQuestions ? (
        <Spinner className="iu-m-500" />
      ) : (
        <>
          {!isDisplayingCertificateDraft && getContinueOnDraft()}
          {getQuestionsOrderedByLastUpdatedAndHandled(complementQuestions).map((complementQuestion) => (
            <QuestionItem key={complementQuestion.id} question={complementQuestion} />
          ))}
          {complementQuestions && complementQuestions.length === 0 && (
            <div>
              <ImageCentered imgSrc={noQuestionImage} alt={'Inga frågor'}>
                <p>Det finns ingen kompletteringsbegäran på detta intyg.</p>
              </ImageCentered>
            </div>
          )}
        </>
      )}
    </Wrapper>
  )
}

export default ComplementQuestionPanel
