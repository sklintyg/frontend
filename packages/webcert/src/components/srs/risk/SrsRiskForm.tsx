import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getSrsPredictions, getSrsQuestions } from '../../../store/srs/srsSelectors'
import { CustomButton, InfoBox, SrsAnswer, SrsQuestion } from '@frontend/common'
import SrsRiskFormQuestion from './SrsRiskFormQuestion'
import { hasCurrentRiskDataPoint } from '../srsUtils'

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

  const [answers, setAnswers] = useState(
    questions.map((question) => {
      return { questionId: question.questionId, answerId: getDefaultOptionId(question, usesOldPredictionModel, previousAnswers) }
    })
  )

  const onQuestionChange = (questionId: string, answerId: string) => {
    const newAnswers = answers.filter((answer) => answer.questionId !== questionId)
    newAnswers.push({ questionId: questionId, answerId: answerId })
    setAnswers(newAnswers)
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
        onClick={() => onClick(answers)}
        disabled={hasCurrentRiskDataPoint(predictions)}
      />
    </div>
  )
}

export default SrsRiskForm
