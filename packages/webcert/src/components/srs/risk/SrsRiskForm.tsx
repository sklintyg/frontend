import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getCertificateId,
  getPatientId,
  getPredictionDiagnosisCode,
  getSrsPredictions,
  getSrsQuestions,
} from '../../../store/srs/srsSelectors'
import { CustomButton, InfoBox, SrsAnswer, SrsQuestion } from '@frontend/common'
import { getPredictions } from '../../../store/srs/srsActions'
import SrsRiskFormQuestion from './SrsRiskFormQuestion'

interface Props {
  previousAnswers: SrsAnswer[]
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

const SrsRiskForm: React.FC<Props> = ({ previousAnswers }) => {
  const dispatch = useDispatch()
  const questions = useSelector(getSrsQuestions)
  const patientId = useSelector(getPatientId)
  const certificateId = useSelector(getCertificateId)
  const diagnosisCode = useSelector(getPredictionDiagnosisCode)
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

  const onCalculateRisk = () => {
    dispatch(
      getPredictions({
        patientId: patientId,
        certificateId: certificateId,
        code: diagnosisCode,
        answers: answers,
      })
    )
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
      <CustomButton text="Beräkna" buttonStyle="secondary" onClick={() => onCalculateRisk()} />
    </div>
  )
}

export default SrsRiskForm
