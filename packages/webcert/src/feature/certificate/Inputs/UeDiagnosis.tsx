import Typeahead from '@frontend/common/src/components/Inputs/Typeahead'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { css } from 'styled-components'
import { CertificateDataElement, CertificateDataValueType, Diagnosis, ValueDiagnosis, ValueDiagnosisList } from '@frontend/common/src'
import { useSelector } from 'react-redux'
import { getQuestionHasValidationError } from '../../../store/certificate/certificateSelectors'
import { getDiagnosisTypeahead, resetDiagnosisTypeahead } from '../../../store/utils/utilsActions'
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
  const [codeChanged, setCodeChanged] = React.useState(false)
  const typeaheadResult = useSelector(getDiagnosisTypeaheadResult())
  const dispatch = useAppDispatch()
  const MAX_NUMBER_OF_TYPEAHEAD_RESULTS = 18
  const MIN_CODE_LENGTH = 2

  useEffect(() => {
    setCode('')
    setDescription('')
  }, [selectedCodeSystem])

  const onClose = () => {
    handleClose(false)
  }

  const handleClose = (diagnosisSelected: boolean) => {
    setOpenCode(false)
    setOpenDescription(false)
    if ((!enteredCodeExists() || !diagnosisSelected) && codeChanged) {
      setCode('')
    }
  }

  const updateTypeaheadResult = (searched: string, isCode: boolean) => {
    if (searched !== undefined && searched.length > MIN_CODE_LENGTH) {
      dispatch(
        getDiagnosisTypeahead({
          codeSystem: selectedCodeSystem,
          fragment: searched,
          code: isCode,
          maxNumberOfResults: MAX_NUMBER_OF_TYPEAHEAD_RESULTS,
        })
      )
    } else if (typeaheadResult !== null) {
      dispatch(resetDiagnosisTypeahead())
    }
  }

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.currentTarget.value)
    setOpenCode(true)
    setCodeChanged(true)
    updateTypeaheadResult(event.currentTarget.value.toUpperCase(), true)
  }

  const handleDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const newDescription = event.currentTarget.value
    setDescription(newDescription)
    setOpenDescription(true)
    setCodeChanged(false)
    updateTypeaheadResult(newDescription, false)
    saveDiagnosis(code, newDescription, true)
  }

  function enteredCodeExists(): boolean {
    if (typeaheadResult !== undefined && typeaheadResult !== null && typeaheadResult.resultat === 'OK') {
      const index = typeaheadResult.diagnoser.findIndex((d) => d.kod === code?.toUpperCase())
      return index !== -1
    }
    return false
  }

  const getSuggestions = () => {
    if (typeaheadResult === undefined || typeaheadResult === null || typeaheadResult.resultat !== 'OK') {
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
    setCodeChanged(false)
    handleClose(true)
    saveDiagnosis(newCode, newDesc, false)
  }

  // TODO: Does description&code need to have a value?
  const saveDiagnosis = (code: string, description: string, isDescriptionChange: boolean) => {
    if (enteredCodeExists() || isDescriptionChange) {
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

  const getItemText = (item: string, value: string | undefined, highlighted: boolean) => {
    if (value !== undefined) {
      const searchedDescription = value?.indexOf('|') !== -1 ? value.split('|')[1] : value
      const index = item.toLowerCase().indexOf(searchedDescription.toLowerCase())
      if (index !== -1 && highlighted) {
        return `${item.substr(0, index)} <span class="iu-fw-bold">${item.substr(index, searchedDescription?.length)}</span>${item.substr(
          index + searchedDescription?.length,
          item.length
        )}`
      } else return item
    } else return item
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
        onClose={onClose}
        getItemText={getItemText}
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
        highlighted={true}
        onClose={onClose}
        getItemText={getItemText}
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
