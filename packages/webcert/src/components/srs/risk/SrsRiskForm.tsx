import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCertificateId, getDiagnosisCode, getPatientId, getSrsQuestions } from '../../../store/srs/srsSelectors'
import { CustomButton, SrsInformationChoice, SrsQuestion } from '@frontend/common'
import { getPredictions } from '../../../store/srs/srsActions'
import SrsRiskFormQuestion from './SrsRiskFormQuestion'

const getDefaultOptionId = (question: SrsQuestion) => {
  const option = question.answerOptions.find((option) => option.defaultValue)
  return option ? option.id : ''
}

const SrsRiskForm: React.FC = () => {
  const questions = useSelector(getSrsQuestions)
  const patientId = useSelector(getPatientId)
  const certificateId = useSelector(getCertificateId)
  const diagnosisCode = useSelector(getDiagnosisCode(SrsInformationChoice.RECOMMENDATIONS))
  const [answers, setAnswers] = useState(
    questions.map((question) => {
      return { questionId: question.questionId, answerId: getDefaultOptionId(question) }
    })
  )
  const dispatch = useDispatch()

  const onQuestionChange = (questionId: string, answerId: string) => {
    const index = answers.findIndex((answer) => answer.questionId === questionId)
    const newAnswer = { questionId: questionId, answerId: answerId }

    if (index === -1) {
      answers.push(newAnswer)
    } else {
      answers[index] = newAnswer
    }

    setAnswers(answers)
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
      {questions.map((question) => {
        return <SrsRiskFormQuestion question={question} onChange={onQuestionChange} key={question.questionId} />
      })}
      <CustomButton text="Beräkna" buttonStyle="secondary" onClick={() => onCalculateRisk()} />
    </div>
  )
}

export default SrsRiskForm
