import { CertificateDataElement, ConfigUeDiagnoses, QuestionValidationTexts, RadioButton, ValueDiagnosisList } from '@frontend/common'
import * as React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppDispatch } from '../../../../store/store'
import UeDiagnosis from './UeDiagnosis'

const RadioWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 0.9375rem;

  div {
    padding-right: 0.9375rem;
  }
`

export interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const UeDiagnoses: React.FC<Props> = ({ question, disabled }) => {
  const questionConfig = question.config as ConfigUeDiagnoses
  const questionValue = question.value as ValueDiagnosisList
  const firstSavedItem = questionValue.list.find((value) => value && value.terminology !== '')
  const [selectedCodeSystem, setSelectedCodeSystem] = useState(
    questionValue.list.length > 0 && firstSavedItem ? firstSavedItem.terminology : questionConfig.terminology[0].id
  )
  const validationErrors = useSelector(getVisibleValidationErrors(question.id))
  const fields = questionConfig.list.map((diagnosis) => diagnosis.id)
  const dispatch = useAppDispatch()

  const handleCodeSystemChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    resetDiagnosisList()
    setSelectedCodeSystem(event.currentTarget.name)
  }

  const resetDiagnosisList = () => {
    const updatedQuestion: CertificateDataElement = { ...question }
    const updatedQuestionValue = { ...(updatedQuestion.value as ValueDiagnosisList) }
    updatedQuestionValue.list = []
    updatedQuestion.value = updatedQuestionValue
    dispatch(updateCertificateDataElement(updatedQuestion))
  }

  return (
    <>
      <p>Välj kodverk:</p>
      <RadioWrapper>
        {questionConfig.terminology.map((terminology) => {
          return (
            <RadioButton
              key={terminology.id}
              disabled={disabled}
              label={terminology.label}
              name={terminology.id}
              id={terminology.id}
              value={terminology.id}
              checked={selectedCodeSystem === terminology.id}
              onChange={handleCodeSystemChange}
            />
          )
        })}
      </RadioWrapper>
      <p>Diagnoskod enligt ICD-10 SE</p>
      <div>
        {questionConfig.list.map((diagnosis, index) => {
          const diagnosisValidationErrors = validationErrors.filter((validation) => validation.field === diagnosis.id)
          return (
            <UeDiagnosis
              hasValidationError={(index === 0 && validationErrors.length === 1) || diagnosisValidationErrors.length > 0}
              key={`${diagnosis.id}-diagnosis`}
              question={question}
              disabled={disabled}
              id={diagnosis.id}
              selectedCodeSystem={selectedCodeSystem}
              validationErrors={diagnosisValidationErrors}
            />
          )
        })}
      </div>
      {validationErrors.length === 1 && (
        <QuestionValidationTexts validationErrors={validationErrors.filter((error) => !fields.includes(error.field))} />
      )}
    </>
  )
}

export default UeDiagnoses
