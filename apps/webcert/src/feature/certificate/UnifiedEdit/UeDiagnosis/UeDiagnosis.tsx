import { debounce } from 'lodash-es'
import React, { useEffect, useRef } from 'react'
import { shallowEqual } from 'react-redux'
import styled, { css } from 'styled-components'
import Typeahead from '../../../../components/Inputs/Typeahead'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import { getDiagnosisTypeahead, resetDiagnosisTypeahead } from '../../../../store/utils/utilsActions'
import { getDiagnosisTypeaheadResult } from '../../../../store/utils/utilsSelectors'
import type {
  CertificateDataElement,
  Diagnosis,
  TextValidation,
  ValidationError,
  ValueDiagnosis,
  ValueDiagnosisList,
} from '../../../../types'
import { CertificateDataValidationType, CertificateDataValueType } from '../../../../types'

interface Props {
  question: CertificateDataElement
  disabled: boolean
  id: string
  selectedCodeSystem: string
  validationErrors: ValidationError[]
  hasValidationError: boolean
}

const Wrapper = styled.div`
  :not(:last-child) {
    padding-bottom: 0.9375rem;
  }
  display: grid;
  align-items: flex-start;
  grid-template-columns: 120px repeat(3, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0.9375rem;
  grid-template-areas:
    'code diagnosis diagnosis diagnosis'
    'codeError descError descError descError';
`

const ValidationErrorWrapper = styled.div`
  grid-area: 2 / span 4;
`

const codeAdditionalStyles = css`
  grid-area: code;
`

const DescriptionAdditional = styled.div`
  grid-area: diagnosis;
`

const UeDiagnosis = ({ disabled, id, selectedCodeSystem, question, validationErrors, hasValidationError }: Props) => {
  const savedDiagnosis = (question.value as ValueDiagnosisList).list.find((item) => item && item.id === id)
  const [description, setDescription] = React.useState(savedDiagnosis !== undefined ? savedDiagnosis.description : '')
  const [code, setCode] = React.useState(savedDiagnosis !== undefined ? savedDiagnosis.code : '')
  const [codeChanged, setCodeChanged] = React.useState(false)
  const typeaheadResult = useAppSelector(getDiagnosisTypeaheadResult(), shallowEqual)
  const dispatch = useAppDispatch()
  const codeInput = React.createRef<HTMLInputElement>()
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
    if (codeChanged && !diagnosisSelected && !isCodeInputFocused) {
      setCode('')
    }
    dispatch(resetDiagnosisTypeahead())
  }

  const updateTypeaheadResult = (searched: string, isCode: boolean, selectedCodeSystem: string) => {
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
    setCodeChanged(true)
    if (newCode === undefined || newCode === '') {
      setDescription('')
      dispatchUpdateDiagnosis(question, '', '', selectedCodeSystem)
    } else {
      dispatchUpdateDiagnosis(question, '', description, selectedCodeSystem)
    }
    updateTypeaheadResult(newCode.toUpperCase(), true, selectedCodeSystem)
  }

  const handleDescriptionChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const newDescription = event.currentTarget.value
    setDescription(newDescription)
    setCodeChanged(false)
    if (newDescription === '') {
      setCode('')
      dispatchUpdateDiagnosis(question, '', newDescription, selectedCodeSystem)
    } else {
      dispatchUpdateDiagnosis(question, code, newDescription, selectedCodeSystem)
    }
    dispatchTypeahead(newDescription, selectedCodeSystem)
  }

  const dispatchTypeahead = useRef(
    debounce((value: string, selectedCodeSystem: string) => {
      updateTypeaheadResult(value, false, selectedCodeSystem)
    }, 150)
  ).current

  const dispatchUpdateDiagnosis = useRef(
    debounce((question: CertificateDataElement, code: string, description: string, selectedCodeSystem: string) => {
      updateSavedDiagnosis(question, code, description, selectedCodeSystem)
    }, 500)
  ).current

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
    dispatchUpdateDiagnosis(question, newCode, newDesc, selectedCodeSystem)
  }

  const updateSavedDiagnosis = (question: CertificateDataElement, code: string, description: string, selectedCodeSystem: string) => {
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

  const getItemText = (item: string, value: string | number | readonly string[] | undefined) => {
    if (value !== undefined) {
      const itemDescription = getDescriptionFromString(item)
      const itemCode = getCodeFromString(item)
      const regex = new RegExp(
        `(${String(value)
          .replace(/\\/g, '\\\\')
          .replace(/([()[\]])/g, '\\$1')})`,
        'ig'
      )
      return `${itemCode} ${DIAGNOSIS_DIVIDER} ${itemDescription.replace(regex, '<span class="iu-fw-bold">$1</span>')}`
    } else return item
  }

  const isShortPsychologicalDiagnosis = (code: string) => {
    const isPsychologicalDiagnosis = code.slice(0, 3) === 'Z73' || code.slice(0, 1) === 'F'
    return code.length < 4 && isPsychologicalDiagnosis
  }

  const suggestions = (typeaheadResult?.diagnoser ?? [])
    .filter((diagnosis) => {
      return !(question.value as ValueDiagnosisList).list.find((value) => value.code === diagnosis.kod)
    })
    .map((diagnosis: Diagnosis) => {
      const isDisabled = isShortPsychologicalDiagnosis(diagnosis.kod)
      return {
        label: `${diagnosis.kod} ${DIAGNOSIS_DIVIDER} ${diagnosis.beskrivning}`,
        disabled: isDisabled,
        title: isDisabled ? 'Diagnoskod måste anges på fyrställig nivå' : null,
      }
    })

  return (
    <>
      <Wrapper key={`${id}-wrapper`}>
        <Typeahead
          ref={codeInput}
          suggestions={suggestions}
          css={codeAdditionalStyles}
          placeholder="Kod"
          data-testid={`${id}-code`}
          disabled={disabled}
          hasValidationError={hasValidationError}
          onSuggestionSelected={onDiagnosisSelected}
          value={code}
          onChange={handleCodeChange}
          onClose={onClose}
          moreResults={typeaheadResult?.moreResults}
        />
        <DescriptionAdditional>
          <Typeahead
            suggestions={suggestions}
            placeholder="Diagnos"
            data-testid={`${id}-diagnos`}
            disabled={disabled}
            hasValidationError={hasValidationError}
            onSuggestionSelected={onDiagnosisSelected}
            value={description}
            onChange={handleDescriptionChange}
            onClose={onClose}
            getItemText={getItemText}
            moreResults={typeaheadResult?.moreResults}
            limit={textValidation ? textValidation.limit : 250}
          />
        </DescriptionAdditional>
        <ValidationErrorWrapper>
          <QuestionValidationTexts validationErrors={validationErrors} />
        </ValidationErrorWrapper>
      </Wrapper>
    </>
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
  let updatedValueList = [...(updatedQuestionValue.list as ValueDiagnosis[])]
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
    if (isDiagnosisEmpty) {
      updatedValueList = updatedValueList.filter((diagnosis) => diagnosis.id !== valueDiagnosis.id)
    } else {
      updatedValueList[savedDiagnosisIndex] = valueDiagnosis
    }
  }

  updatedQuestionValue.list = updatedValueList
  updatedQuestion.value = updatedQuestionValue
  return updatedQuestion
}

export default UeDiagnosis
