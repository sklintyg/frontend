import * as React from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../../store/store'
import { CertificateDataElement, CertificateDataValueType, ConfigUeDiagnoses, ValueDiagnosisList, ValueDiagnosis } from '@frontend/common'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import { QuestionValidationTexts, RadioButton } from '@frontend/common'
import { useEffect, useState } from 'react'
import { getDiagnosisTypeaheadResult } from '../../../store/utils/utilsSelectors'
import styled from 'styled-components'
import UeDiagnosis from './UeDiagnosis'

const RadioWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 10px;

  div {
    padding-right: 10px;
  }
`

interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const UeDiagnoses: React.FC<Props> = ({ question, disabled }) => {
  const questionConfig = question.config as ConfigUeDiagnoses
  const questionValue = question.value as ValueDiagnosisList
  const [selectedCodeSystem, setSelectedCodeSystem] = useState(
    questionValue.list.length > 0 ? questionValue.list[0].terminology : questionConfig.terminology[0].id
  )
  const isShowValidationError = useSelector(getShowValidationErrors)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (enteredCodeExists()) {
      const diagnosisValue: ValueDiagnosis = {
        type: CertificateDataValueType.DIAGNOSIS,
        id: '1',
        terminology: selectedCodeSystem,
        code: currentCodeValue,
        description: 'Description',
      }
      const updatedValue = getUpdatedValue(question, diagnosisValue)
      dispatch(updateCertificateDataElement(updatedValue))
    }
    // else {
    //   const diagnosisValue: ValueDiagnosis = {
    //     type: CertificateDataValueType.DIAGNOSIS,
    //     id: '1',
    //     terminology: selectedCodeSystem,
    //     code: currentCodeValue,
    //     description: 'Description',
    //   }
    //   const updatedValue = getUpdatedValue(question, diagnosisValue)
    //   dispatch(updateCertificateDataElement(updatedValue))
    // }
  }, [diagnosisTypeaheadResult])

  function enteredCodeExists(): boolean {
    if (diagnosisTypeaheadResult !== null && diagnosisTypeaheadResult.resultat === 'OK') {
      for (const index in diagnosisTypeaheadResult.diagnoser) {
        if (diagnosisTypeaheadResult.diagnoser[index].kod.toLowerCase() === currentCodeValue) {
          return true
        }
      }
    }
    return false
  }

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

  //TODO: F50 får tydligen inte väljas enligt nuvarande diagnos-komponent
  //TODO: Texterna ovanför radioknapparna och inputarna
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
      {questionConfig.list.map((diagnosis) => {
        return (
          <UeDiagnosis
            key={diagnosis.id + '-diagnosis'}
            question={question}
            disabled={disabled}
            id={diagnosis.id}
            selectedCodeSystem={selectedCodeSystem}></UeDiagnosis>
        )
      })}
      {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors} />}
    </>
  )
}

function getUpdatedValue(question: CertificateDataElement, valueDiagnosis: ValueDiagnosis): CertificateDataElement {
  const updatedQuestion: CertificateDataElement = { ...question }
  const updatedQuestionValue = { ...(updatedQuestion.value as ValueDiagnosisList) }
  let updatedValueList = [...(updatedQuestionValue.list as ValueDiagnosis[])]
  const updatedValueIndex = updatedValueList.findIndex((val) => val.id === valueDiagnosis.id)
  if (updatedValueIndex === -1) {
    updatedValueList = [...updatedValueList, valueDiagnosis as ValueDiagnosis]
  }
  updatedQuestionValue.list = updatedValueList
  updatedQuestion.value = updatedQuestionValue
  return updatedQuestion
}

export default UeDiagnoses
