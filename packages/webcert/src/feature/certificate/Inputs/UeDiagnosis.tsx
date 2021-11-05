import Typeahead from '@frontend/common/src/components/Inputs/Typeahead'
import React, { useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import {
  CertificateDataElement,
  CertificateDataValueType,
  Diagnosis,
  ValueDiagnosis,
  ValueDiagnosisList,
  QuestionValidationTexts,
} from '@frontend/common'
import { useSelector } from 'react-redux'
import { getDiagnosisTypeahead, resetDiagnosisTypeahead } from '../../../store/utils/utilsActions'
import { useAppDispatch } from '../../../store/store'
import { updateCertificateDataElement } from '../../../store/certificate/certificateActions'
import { getDiagnosisTypeaheadResult } from '../../../store/utils/utilsSelectors'
import _ from 'lodash'
import { CertificateDataValidationType, TextValidation } from '@frontend/common/src'

interface Props {
  question: CertificateDataElement
  disabled: boolean
  id: string
  selectedCodeSystem: string
  isShowValidationError?: boolean
}

const Wrapper = styled.div`
  padding-top: 15px;
  display: grid;
  align-items: flex-start;
  grid-template-columns: 150px repeat(3, 1fr);
  grid-column-gap: 10px;
  grid-template-rows: 1fr;
  grid-template-areas:
    'code diagnosis diagnosis diagnosis'
    'ulc ul ul ul';
`

const codeAdditionalStyles = css`
  max-width: 150px;
  grid-area: code;
`

const descriptionAdditionalStyles = css`
  grid-area: diagnosis;
`

const codeListStyles = css`
  position: relative;
  grid-column-end: ul;
  grid-column-start: ulc;
`

const descriptionListStyles = css`
  position: relative;
  grid-column-end: ul;
  grid-column-start: ul;
`

const UeDiagnosis: React.FC<Props> = ({ disabled, id, selectedCodeSystem, question, isShowValidationError }) => {
  const savedDiagnosis = (question.value as ValueDiagnosisList).list.find((item) => item && item.id === id)
  const [description, setDescription] = React.useState(savedDiagnosis !== undefined ? savedDiagnosis.description : '')
  const [code, setCode] = React.useState(savedDiagnosis !== undefined ? savedDiagnosis.code : '')
  const [openDescription, setOpenDescription] = React.useState(false)
  const [openCode, setOpenCode] = React.useState(false)
  const [codeChanged, setCodeChanged] = React.useState(false)
  const typeaheadResult = useSelector(getDiagnosisTypeaheadResult())
  const dispatch = useAppDispatch()
  const codeInput = React.createRef<HTMLInputElement>()
  const diagnosisInput = React.createRef<HTMLInputElement>()
  const textValidation = question.validation
    ? (question.validation.find((v) => v.type === CertificateDataValidationType.TEXT_VALIDATION) as TextValidation)
    : undefined

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
    const isCodeInputFocused = document.activeElement === codeInput.current
    setOpenCode(false)
    setOpenDescription(false)
    if (codeChanged && !diagnosisSelected && !isCodeInputFocused) {
      setCode('')
    }
    dispatch(resetDiagnosisTypeahead())
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
      setDescription('')
      updateSavedDiagnosis(question, '', '')
    } else {
      updateSavedDiagnosis(question, '', description)
    }
    updateTypeaheadResult(newCode.toUpperCase(), true)
  }

  const handleDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const newDescription = event.currentTarget.value
    setDescription(newDescription)
    setOpenDescription(true)
    setCodeChanged(false)
    if (newDescription === '') {
      setCode('')
      dispatchUpdateDiagnosisWithNewDescription(question, '', newDescription)
    } else {
      dispatchUpdateDiagnosisWithNewDescription(question, code, newDescription)
    }
    dispatchTypeahead(newDescription)
  }

  const dispatchTypeahead = useRef(
    _.debounce((value: string) => {
      updateTypeaheadResult(value, false)
    }, 150)
  ).current

  const dispatchUpdateDiagnosisWithNewDescription = useRef(
    _.debounce((question: CertificateDataElement, code: string, description: string) => {
      updateSavedDiagnosis(question, code, description)
    }, 500)
  ).current

  const getSuggestions = () => {
    if (typeaheadResult === undefined || typeaheadResult === null || typeaheadResult.resultat !== 'OK') {
      return []
    }
    return typeaheadResult.diagnoser
      .filter((diagnosis) => {
        return !(question.value as ValueDiagnosisList).list.find((value) => value.code === diagnosis.kod)
      })
      .map((diagnosis: Diagnosis) => {
        const isDisabled = isShortPsychologicalDiagnosis(diagnosis.kod)
        return {
          label: diagnosis.kod + ' ' + DIAGNOSIS_DIVIDER + ' ' + diagnosis.beskrivning,
          disabled: isDisabled,
          title: isDisabled ? 'Diagnoskod måste anges på fyrställig nivå' : null,
        }
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
    updateSavedDiagnosis(question, newCode, newDesc)
  }

  const updateSavedDiagnosis = (question: CertificateDataElement, code: string, description: string) => {
    const diagnosisValue: ValueDiagnosis = {
      type: CertificateDataValueType.DIAGNOSIS,
      id: id,
      terminology: selectedCodeSystem,
      code: code,
      description: description,
    }
    const updatedValue = getUpdatedValue(question, diagnosisValue)
    if (updatedValue !== null) {
      dispatch(updateCertificateDataElement(updatedValue))
    }
  }

  const getItemText = (item: string, searched: string | undefined) => {
    if (searched !== undefined) {
      const itemDescription = getDescriptionFromString(item)
      const itemCode = getCodeFromString(item)
      const regex = new RegExp(`(${searched})`, 'ig')
      return itemCode + ' ' + DIAGNOSIS_DIVIDER + ' ' + itemDescription.replace(regex, '<span class="iu-fw-bold">$1</span>')
    } else return item
  }

  const isShortPsychologicalDiagnosis = (code: string) => {
    const isPsychologicalDiagnosis = code.substr(0, 3) === 'Z73' || code.substr(0, 1) === 'F'
    return code.length < 4 && isPsychologicalDiagnosis
  }

  const getValidationErrors = (isCode: boolean) => {
    if (!question || !question.validationErrors || question.validationErrors.length === 0) {
      return []
    }

    return question.validationErrors.filter(
      (v) =>
        v.field.includes('[' + (parseInt(id) - 1) + ']' + (isCode ? '.diagnoskod' : '.diagnosbeskrivning')) ||
        v.field.includes('[' + (parseInt(id) - 1) + ']' + '.row')
    )
  }

  const hasValidationErrors = () => {
    return isShowValidationError && getValidationErrors(true).length > 0
  }

  return (
    <Wrapper key={id + '-wrapper'}>
      <Typeahead
        ref={codeInput}
        suggestions={getSuggestions()}
        inputStyles={codeAdditionalStyles}
        listStyles={codeListStyles}
        placeholder="Kod"
        disabled={disabled}
        hasValidationError={hasValidationErrors()}
        onSuggestionSelected={onDiagnosisSelected}
        value={code}
        open={openCode}
        onChange={handleCodeChange}
        onClose={onClose}
        moreResults={typeaheadResult?.moreResults}
      />
      {isShowValidationError && <QuestionValidationTexts validationErrors={getValidationErrors(true)} />}
      <Typeahead
        ref={diagnosisInput}
        suggestions={getSuggestions()}
        placeholder="Diagnos"
        disabled={disabled}
        inputStyles={descriptionAdditionalStyles}
        listStyles={descriptionListStyles}
        hasValidationError={hasValidationErrors()}
        onSuggestionSelected={onDiagnosisSelected}
        value={description}
        onChange={handleDescriptionChange}
        open={openDescription}
        highlighted={true}
        onClose={onClose}
        getItemText={getItemText}
        moreResults={typeaheadResult?.moreResults}
        limit={textValidation ? textValidation.limit : 250}
      />
    </Wrapper>
  )
}

const checkIsDiagnosisEmpty = (valueDiagnosis: ValueDiagnosis): boolean => {
  return (
    (valueDiagnosis.code === undefined || valueDiagnosis.code === '') &&
    (valueDiagnosis.description === undefined || valueDiagnosis.description === '')
  )
}

const duplicateDiagnosisIsSaved = (updatedValueList: ValueDiagnosis[], valueDiagnosis: ValueDiagnosis): boolean => {
  return updatedValueList.some(
    (v) =>
      valueDiagnosis && v && valueDiagnosis.id === v.id && valueDiagnosis.code === v.code && valueDiagnosis.description === v.description
  )
}

function getUpdatedValue(question: CertificateDataElement, valueDiagnosis: ValueDiagnosis): CertificateDataElement | null {
  const updatedQuestion: CertificateDataElement = { ...question }
  const updatedQuestionValue = { ...(updatedQuestion.value as ValueDiagnosisList) }
  const updatedValueList = [...(updatedQuestionValue.list as ValueDiagnosis[])]
  const savedDiagnosisIndex = updatedValueList.findIndex((val) => val.id === valueDiagnosis.id)
  const diagnosisIsSaved = savedDiagnosisIndex !== -1
  const isDiagnosisEmpty = checkIsDiagnosisEmpty(valueDiagnosis)

  if (updatedValueList.length === 0 && isDiagnosisEmpty) return null

  if ((isDiagnosisEmpty && !diagnosisIsSaved) || duplicateDiagnosisIsSaved(updatedValueList, valueDiagnosis)) {
    return null
  }

  if (!diagnosisIsSaved) {
    if (!isDiagnosisEmpty) {
      updatedValueList.push(valueDiagnosis)
    }
  } else {
    updatedValueList[savedDiagnosisIndex] = valueDiagnosis
  }

  updatedQuestionValue.list = updatedValueList
  updatedQuestion.value = updatedQuestionValue
  return updatedQuestion
}

export default UeDiagnosis
