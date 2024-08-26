import type React from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateHasUpdatedAnswers } from '../../../store/srs/srsActions'
import { getHasUpdatedAnswers, getSrsPredictions, getSrsQuestions } from '../../../store/srs/srsSelectors'
import type { SrsAnswer, SrsQuestion } from '../../../types'
import { CustomButton } from '../../Inputs/CustomButton'
import InfoBox from '../../utils/InfoBox'
import { hasCurrentRiskDataPoint } from '../srsUtils'
import SrsRiskFormQuestion from './SrsRiskFormQuestion'

interface Props {
  previousAnswers: SrsAnswer[]
  onClick: (answers: SrsAnswer[]) => void
}

const getDefaultOptionId = (question: SrsQuestion, usesOldPredictionModel: boolean, previousAnswers: SrsAnswer[]) => {
  if (previousAnswers) {
    const previousAnswer = previousAnswers.find((answer) => answer.questionId === question.questionId)

    if (!usesOldPredictionModel && previousAnswer) {
      return previousAnswer.answerId
    }
  }

  const option = question.answerOptions.find((option) => option.defaultValue)
  return option ? option.id : ''
}

const SrsRiskForm: React.FC<Props> = ({ previousAnswers, onClick }) => {
  const questions = useSelector(getSrsQuestions)
  const predictions = useSelector(getSrsPredictions)
  const usesOldPredictionModel = predictions.some((prediction) => prediction.modelVersion === '2.1')
  const hasUpdatedAnswers = useSelector(getHasUpdatedAnswers)
  const dispatch = useDispatch()

  const [answers, setAnswers] = useState(
    questions.map((question) => {
      return {
        questionId: question.questionId,
        answerId: getDefaultOptionId(question, usesOldPredictionModel, previousAnswers),
      }
    })
  )

  const onQuestionChange = (questionId: string, answerId: string) => {
    const newAnswers = answers.filter((answer) => answer.questionId !== questionId)
    newAnswers.push({ questionId: questionId, answerId: answerId })
    setAnswers(newAnswers)
    dispatch(updateHasUpdatedAnswers(true))
  }

  const calculateRisk = () => {
    onClick(answers)
    dispatch(updateHasUpdatedAnswers(false))
  }

  return (
    <div>
      {usesOldPredictionModel && (
        <InfoBox type="info" activateIconWrap additionalStyles="iu-mb-200">
          Tidigare risk beräknades med annan version av prediktionsmodellen. Svaren nedan är inte därför inte patientens tidigare svar utan
          en grundinställning för respektive fråga.
        </InfoBox>
      )}
      {questions.map((question) => {
        return (
          <SrsRiskFormQuestion
            question={question}
            onChange={onQuestionChange}
            key={question.questionId}
            checkedOption={getDefaultOptionId(question, usesOldPredictionModel, previousAnswers)}
          />
        )
      })}
      <CustomButton
        text="Beräkna"
        buttonStyle="secondary"
        onClick={calculateRisk}
        disabled={hasCurrentRiskDataPoint(predictions) && !hasUpdatedAnswers}
      />
    </div>
  )
}

export default SrsRiskForm
