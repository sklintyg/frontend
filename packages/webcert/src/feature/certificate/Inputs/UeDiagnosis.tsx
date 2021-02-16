import Typeahead from '@frontend/common/src/components/Inputs/Typeahead'
import * as React from 'react'
import styled from 'styled-components'
import { css } from 'styled-components'
import { CertificateDataElement, CertificateDataValueType, Diagnosis, ValueDiagnosis, ValueDiagnosisList } from '@frontend/common/src'
import { useSelector } from 'react-redux'
import { getQuestionHasValidationError } from '../../../store/certificate/certificateSelectors'
import { getDiagnosisTypeahead } from '../../../store/utils/utilsActions'
import { useAppDispatch } from '../../../store/store'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { getDiagnosisTypeaheadResult } from '../../../store/utils/utilsSelectors'

interface Props {
  question: CertificateDataElement
  disabled: boolean
  id: string
  selectedCodeSystem: string
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 10px;
`

const codeAdditionalStyles = css`
  max-width: 150px !important;
  padding-right: 10px;
`

const UeDiagnosis: React.FC<Props> = ({ disabled, id, selectedCodeSystem, question }) => {
  const shouldDisplayValidationError = useSelector(getQuestionHasValidationError(question.id))
  const savedDiagnosis = (question.value as ValueDiagnosisList).list.find((item) => item.id === id)
  const [description, setDescription] = React.useState(savedDiagnosis !== undefined ? savedDiagnosis.description : '')
  const [code, setCode] = React.useState(savedDiagnosis !== undefined ? savedDiagnosis.code : '')
  const [openDescription, setOpenDescription] = React.useState(false)
  const [openCode, setOpenCode] = React.useState(false)
  const typeaheadResult = useSelector(getDiagnosisTypeaheadResult())
  const dispatch = useAppDispatch()
  const MAX_NUMBER_OF_TYPEAHEAD_RESULTS = 18
  const MIN_CODE_LENGTH = 2

  const updateTypeaheadResult = (searched: string) => {
    if (searched !== undefined && searched.length > MIN_CODE_LENGTH) {
      dispatch(
        getDiagnosisTypeahead({
          codeSystem: selectedCodeSystem,
          codeFragment: searched,
          maxNumberOfResults: MAX_NUMBER_OF_TYPEAHEAD_RESULTS,
        })
      )
    }
  }

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.currentTarget.value)
    setOpenCode(true)
    updateTypeaheadResult(event.currentTarget.value.toUpperCase())
  }

  const handleDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setDescription(event.currentTarget.value)
    setOpenDescription(true)
    updateTypeaheadResult(event.currentTarget.value)
    saveDiagnosis(code, description)
  }

  function enteredCodeExists(): boolean {
    if (typeaheadResult !== undefined && typeaheadResult !== null && typeaheadResult.resultat === 'OK') {
      const index = typeaheadResult.diagnoser.findIndex((d) => d.kod === code?.toUpperCase())
      return index !== -1
    }
    return false
  }

  const getSuggestions = () => {
    if (
      typeaheadResult === undefined ||
      typeaheadResult === null ||
      typeaheadResult.resultat !== 'OK' ||
      !code ||
      code.length <= MIN_CODE_LENGTH
    ) {
      return []
    }
    return typeaheadResult.diagnoser.map((diagnosis: Diagnosis) => {
      return diagnosis.kod + ' | ' + diagnosis.beskrivning
    })
  }

  const onDiagnosisSelected = (value: string) => {
    const newCode = value.split('|')[0].trim()
    const newDesc = value.split('|')[1].substring(1)
    setCode(newCode.toUpperCase())
    setDescription(newDesc)
    setOpenCode(false)
    setOpenDescription(false)
    saveDiagnosis()
  }

  // TODO: Does description&code need to have a value?
  const saveDiagnosis = (code: string, description: string) => {
    if (enteredCodeExists()) {
      const diagnosisValue: ValueDiagnosis = {
        type: CertificateDataValueType.DIAGNOSIS,
        id: id,
        terminology: selectedCodeSystem,
        code: code,
        description: description,
      }
      const updatedValue = getUpdatedValue(question, diagnosisValue)
      dispatch(updateCertificateDataElement(updatedValue))
    }
  }

  return (
    <Wrapper key={id + '-wrapper'}>
      <Typeahead
        suggestions={getSuggestions()}
        additionalStyles={codeAdditionalStyles}
        placeholder="Kod"
        key={id + '-code'}
        id={id}
        disabled={disabled}
        hasValidationError={shouldDisplayValidationError}
        onSuggestionSelected={onDiagnosisSelected}
        value={code}
        open={openCode}
        onChange={handleCodeChange}
      />
      <Typeahead
        suggestions={getSuggestions()}
        key={id + '-description'}
        placeholder="Diagnos"
        disabled={disabled}
        hasValidationError={shouldDisplayValidationError}
        onSuggestionSelected={onDiagnosisSelected}
        id={id}
        value={description}
        onChange={handleDescriptionChange}
        open={openDescription}
        highlight={true}
      />
    </Wrapper>
  )
}

function getUpdatedValue(question: CertificateDataElement, valueDiagnosis: ValueDiagnosis): CertificateDataElement {
  const updatedQuestion: CertificateDataElement = { ...question }
  const updatedQuestionValue = { ...(updatedQuestion.value as ValueDiagnosisList) }
  let updatedValueList = [...(updatedQuestionValue.list as ValueDiagnosis[])]
  const updatedValueIndex = updatedValueList.findIndex((val) => val.id === valueDiagnosis.id)
  if (updatedValueIndex === -1) {
    updatedValueList = [...updatedValueList, valueDiagnosis as ValueDiagnosis]
  } else {
    updatedValueList[updatedValueIndex] = valueDiagnosis
  }
  updatedQuestionValue.list = updatedValueList
  updatedQuestion.value = updatedQuestionValue
  return updatedQuestion
}

export default UeDiagnosis
