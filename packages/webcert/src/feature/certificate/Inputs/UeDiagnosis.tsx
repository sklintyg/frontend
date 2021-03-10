import Typeahead from '@frontend/common/src/components/Inputs/Typeahead'
import React, { useEffect, useRef } from 'react'
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
  const MIN_CODE_LENGTH = 3
  const MIN_DESCRIPTION_LENGTH = 1
  const DIAGNOSIS_DIVIDER = '|'

  const isMounted = useRef(false)

  useEffect(() => {
    if (isMounted.current) {
      setCode('')
      setDescription('')
    } else {
      isMounted.current = true
    }
  }, [selectedCodeSystem])

  const onClose = () => {
    handleClose(false)
  }

  const handleClose = (diagnosisSelected: boolean) => {
    setOpenCode(false)
    setOpenDescription(false)
    if ((!enteredCodeExists() || codeChanged) && !diagnosisSelected) {
      setCode('')
    }
  }

  const updateTypeaheadResult = (searched: string, isCode: boolean) => {
    if (
      searched !== undefined &&
      ((isCode && searched.length >= MIN_CODE_LENGTH) || (!isCode && searched.length >= MIN_DESCRIPTION_LENGTH))
    ) {
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
    const newCode = event.currentTarget.value
    setCode(newCode)
    setOpenCode(true)
    setCodeChanged(true)
    if (newCode === undefined || newCode === '') {
      updateSavedDiagnosis(newCode, description, false)
    }
    updateTypeaheadResult(newCode.toUpperCase(), true)
  }

  const handleDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const newDescription = event.currentTarget.value
    setDescription(newDescription)
    setOpenDescription(true)
    setCodeChanged(false)
    updateTypeaheadResult(newDescription, false)
    updateSavedDiagnosis(code, newDescription, true)
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
      return diagnosis.kod + ' ' + DIAGNOSIS_DIVIDER + ' ' + diagnosis.beskrivning
    })
  }

  const getCodeFromString = (diagnosis: string) => {
    return diagnosis.indexOf(DIAGNOSIS_DIVIDER) !== -1 ? diagnosis.split(DIAGNOSIS_DIVIDER)[0].trim() : diagnosis
  }

  const getDescriptionFromString = (diagnosis: string) => {
    return diagnosis.indexOf(DIAGNOSIS_DIVIDER) !== -1 ? diagnosis.split(DIAGNOSIS_DIVIDER)[1].substring(1) : diagnosis
  }

  const onDiagnosisSelected = (value: string) => {
    const newCode = getCodeFromString(value)
    const newDesc = getDescriptionFromString(value)
    setCode(newCode.toUpperCase())
    setDescription(newDesc)
    setCodeChanged(false)
    handleClose(true)
    updateSavedDiagnosis(newCode, newDesc, false)
  }

  const updateSavedDiagnosis = (code: string, description: string, isDescriptionChange: boolean) => {
    if (enteredCodeExists() || isDescriptionChange || code === undefined || code === '') {
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

  const getItemText = (item: string, searched: string | undefined) => {
    if (searched !== undefined) {
      const itemDescription = getDescriptionFromString(item)
      const regex = new RegExp(`(${searched})`, 'ig')
      return itemDescription.replace(regex, '<span class="iu-fw-bold">$1</span>')
    } else return item
  }

  return (
    <Wrapper key={id + '-wrapper'}>
      <Typeahead
        suggestions={getSuggestions()}
        additionalStyles={codeAdditionalStyles}
        placeholder="Kod"
        disabled={disabled}
        hasValidationError={shouldDisplayValidationError}
        onSuggestionSelected={onDiagnosisSelected}
        value={code}
        open={openCode}
        onChange={handleCodeChange}
        onClose={onClose}
        moreResults={typeaheadResult?.moreResults}
      />
      <Typeahead
        suggestions={getSuggestions()}
        placeholder="Diagnos"
        disabled={disabled}
        hasValidationError={shouldDisplayValidationError}
        onSuggestionSelected={onDiagnosisSelected}
        value={description}
        onChange={handleDescriptionChange}
        open={openDescription}
        highlighted={true}
        onClose={onClose}
        getItemText={getItemText}
        moreResults={typeaheadResult?.moreResults}
      />
    </Wrapper>
  )
}

function getUpdatedValue(question: CertificateDataElement, valueDiagnosis: ValueDiagnosis): CertificateDataElement {
  const diagnosisIsEmpty =
    (valueDiagnosis.code === undefined || valueDiagnosis.code === '') &&
    (valueDiagnosis.description === undefined || valueDiagnosis.description === '')

  const updatedQuestion: CertificateDataElement = { ...question }
  const updatedQuestionValue = { ...(updatedQuestion.value as ValueDiagnosisList) }
  let updatedValueList = [...(updatedQuestionValue.list as ValueDiagnosis[])]
  const updatedValueIndex = updatedValueList.findIndex((val) => val.id === valueDiagnosis.id)
  if (updatedValueIndex === -1) {
    if (!diagnosisIsEmpty) {
      updatedValueList = [...updatedValueList, valueDiagnosis as ValueDiagnosis]
    }
  } else {
    if (!diagnosisIsEmpty) {
      updatedValueList[updatedValueIndex] = valueDiagnosis
    } else {
      updatedValueList.splice(updatedValueIndex, 1)
    }
  }
  updatedQuestionValue.list = updatedValueList
  updatedQuestion.value = updatedQuestionValue
  return updatedQuestion
}

export default UeDiagnosis
