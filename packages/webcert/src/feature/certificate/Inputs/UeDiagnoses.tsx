import * as React from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../../store/store'
import {
  CertificateDataElement,
  CertificateDataValueType,
  ConfigUeDiagnoses,
  ValueDiagnosisList,
  ValueDiagnosis,
  DiagnosisTypeahead,
  Diagnosis,
} from '@frontend/common'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { getQuestionHasValidationError, getShowValidationErrors } from '../../../store/certificate/certificateSelectors'
import { QuestionValidationTexts, RadioButton } from '@frontend/common'
import TextInput from '@frontend/common/src/components/Inputs/TextInput'
import { useEffect, useState } from 'react'
import { getDiagnosisTypeahead } from '../../../store/utils/utilsActions'
import { getDiagnosisTypeaheadResult } from '../../../store/utils/utilsSelectors'

interface Props {
  question: CertificateDataElement
  disabled: boolean
}

const UeDiagnoses: React.FC<Props> = ({ question, disabled }) => {
  const questionConfig = question.config as ConfigUeDiagnoses
  const [selectedCodeSystem, setSelectedCodeSystem] = useState(questionConfig.terminology[0].id)
  const [currentCodeValue, setCurrentCodeValue] = useState('')
  const isShowValidationError = useSelector(getShowValidationErrors)
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))
  const diagnosisTypeaheadResult = useSelector(getDiagnosisTypeaheadResult())
  const diagnosisListValue = getDiagnosisListValue(question)
  const dispatch = useAppDispatch()
  const MAX_NUMBER_OF_TYPEAHEAD_RESULTS = 18
  const MIN_CODE_LENGTH = 2

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
        if (diagnosisTypeaheadResult.diagnoser[index].kod === currentCodeValue) {
          return true
        }
      }
    }
    return false
  }

  const handleCodeSystemChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSelectedCodeSystem(event.currentTarget.name)
  }

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleCodeChange: ' + event.currentTarget.value)
    setCurrentCodeValue(event.currentTarget.value)

    if (event.currentTarget.value !== undefined && event.currentTarget.value.length > MIN_CODE_LENGTH) {
      dispatch(
        getDiagnosisTypeahead({
          codeSystem: selectedCodeSystem,
          codeFragment: event.currentTarget.value.toUpperCase(),
          maxNumberOfResults: MAX_NUMBER_OF_TYPEAHEAD_RESULTS,
        })
      )
    }
  }

  const handleDescriptionChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (event) => {
    // const valueDiagnosis: ValueDiagnosis = {
    //   type: CertificateDataValueType.DIAGNOSIS,
    //   id: event.currentTarget.name,
    //   terminology: selectedCodeSystem,
    //   code: 'F500',
    //   description: 'Anorexia nervosa',
    // }
    // const updatedValue = getUpdatedValue(question, valueDiagnosis)
    // dispatch(updateCertificateDataElement(updatedValue))
  }

  const getOptions = () => {
    if (diagnosisTypeaheadResult === null || diagnosisTypeaheadResult.resultat !== 'OK' || currentCodeValue.length <= MIN_CODE_LENGTH) {
      return
    }

    return diagnosisTypeaheadResult.diagnoser.map((diagnosis) => {
      return <option key={diagnosis.kod + diagnosis.beskrivning} value={diagnosis.kod} label={diagnosis.beskrivning} />
    })
  }

  if (!diagnosisListValue) {
    return <div>Value not supported!</div>
  }

  //TODO: F50 får tydligen inte väljas enligt nuvarande diagnos-komponent
  //TODO: Labels i input (kod, diagnos)
  //TODO: Texterna ovanför radioknapparna och inputarna
  //TODO: Validering under varje input

  return (
    <>
      <div>Välj kodverk:</div>
      <div>
        {questionConfig.terminology.map((terminology) => {
          return (
            <RadioButton
              key={terminology.id}
              disabled={disabled}
              label={terminology.label}
              name={terminology.id}
              value={terminology.id}
              checked={selectedCodeSystem === terminology.id}
              onChange={handleCodeSystemChange}
            />
          )
        })}
      </div>
      <div>Diagnoskod enligt ICD-10 SE</div>
      {questionConfig.list.map((diagnosis) => {
        return (
          <div key={diagnosis.id + 'div'}>
            <input key={diagnosis.id + 'code'} disabled={disabled} type="text" list="typeaheadList" onChange={handleCodeChange} />
            <datalist id="typeaheadList">{getOptions()}</datalist>
            <TextInput
              key={diagnosis.id + 'description'}
              disabled={disabled}
              hasValidationError={shouldDisplayValidationError}
              label="Diagnos"
              name={diagnosis.id}
              onChange={handleDescriptionChange}
            />
          </div>
        )
      })}
      {isShowValidationError && <QuestionValidationTexts validationErrors={question.validationErrors} />}
    </>
  )
}

function getDiagnosisListValue(question: CertificateDataElement): ValueDiagnosisList | null {
  if (question.value?.type !== CertificateDataValueType.DIAGNOSIS_LIST) {
    return null
  }
  return question.value as ValueDiagnosisList
}

function getUpdatedValue(question: CertificateDataElement, valueDiagnosis: ValueDiagnosis): CertificateDataElement {
  //TODO: Jag måste kolla om id redan finns i listan

  const updatedQuestion: CertificateDataElement = { ...question }
  updatedQuestion.value = { ...(updatedQuestion.value as ValueDiagnosisList) }
  ;(updatedQuestion.value as ValueDiagnosisList).list = []
  ;(updatedQuestion.value as ValueDiagnosisList).list.push(valueDiagnosis)
  return updatedQuestion
}

export default UeDiagnoses
