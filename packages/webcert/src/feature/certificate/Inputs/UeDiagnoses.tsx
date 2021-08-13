import * as React from 'react'
import { useSelector } from 'react-redux'
import { CertificateDataElement, ConfigUeDiagnoses, QuestionValidationTexts, RadioButton, ValueDiagnosisList } from '@frontend/common'
import { getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import { useState } from 'react'
import styled from 'styled-components'
import UeDiagnosis from './UeDiagnosis'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../store/store'

const RadioWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 10px;

  div {
    padding-right: 10px;
  }
`

const DiagnosesWrapper = styled.div`
  > * {
    padding-bottom: 5px;
  }
`

interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const UeDiagnoses: React.FC<Props> = ({ question, disabled }) => {
  const questionConfig = question.config as ConfigUeDiagnoses
  const questionValue = question.value as ValueDiagnosisList
  const firstSavedItem = questionValue.list.find((value) => value && value.terminology != '')
  const [selectedCodeSystem, setSelectedCodeSystem] = useState(
    questionValue.list.length > 0 && firstSavedItem ? firstSavedItem.terminology : questionConfig.terminology[0].id
  )
  const isShowValidationError = useSelector(getShowValidationErrors)
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

  //TODO: Validering under varje input

  return (
    <>
      <div className="iu-pt-300">Välj kodverk:</div>
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
      <div className="iu-pt-300">Diagnoskod enligt ICD-10 SE</div>
      <DiagnosesWrapper>
        {questionConfig.list.map((diagnosis) => {
          return (
            <UeDiagnosis
              key={diagnosis.id + '-diagnosis'}
              question={question}
              disabled={disabled}
              id={diagnosis.id}
              selectedCodeSystem={selectedCodeSystem}
              isShowValidationError={isShowValidationError}></UeDiagnosis>
          )
        })}
      </DiagnosesWrapper>
    </>
  )
}

export default UeDiagnoses
