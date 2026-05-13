import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import Typeahead from '../../../../components/Inputs/Typeahead'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import type { ValidationError, ValueDiagnosis } from '../../../../types'
import InvalidCharactersInfoBox from '../InvalidCharactersInfoBox'
import useIso8859Sanitization from '../hooks/useIso8859Sanitization'
import { getDiagnosisItemText, getDiagnosisParts, type useDiagnosisTypeahead } from './hooks/useDiagnosisTypeahead'

const DiagnosisWrapper = styled.div`
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

export function UeDiagnosis({
  id,
  value,
  limit = 250,
  disabled,
  selectedCodeSystem,
  hasValidationError,
  validationErrors,
  onChange,
  suggestions,
  moreResults,
  updateTypeaheadResult,
  resetDiagnosisTypeahead,
}: {
  id: string
  value: ValueDiagnosis
  limit?: number
  disabled: boolean
  selectedCodeSystem: string
  hasValidationError: boolean
  validationErrors: ValidationError[]
  onChange: (value: ValueDiagnosis) => void
} & ReturnType<typeof useDiagnosisTypeahead>) {
  const rawInitialDesc = value.description ?? ''
  const { sanitize, showWarning, sanitizedInitialValue: sanitizedInitialDesc } = useIso8859Sanitization(rawInitialDesc)
  const [{ code, description }, setValue] = useState({ ...value, description: sanitizedInitialDesc })

  useEffect(() => {
    if (!disabled && sanitizedInitialDesc !== rawInitialDesc) {
      onChange({ ...value, description: sanitizedInitialDesc })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDiagnosisSelected = (diagnosis: string) => {
    const { code, description } = getDiagnosisParts(diagnosis)
    resetDiagnosisTypeahead()
    handleUpdate({ ...value, code, description })
  }

  const handleUpdate = (updatedValue: ValueDiagnosis, updateIncomming = true) => {
    if (updateIncomming) {
      onChange(updatedValue)
    }
    setValue(updatedValue)
  }

  return (
    <>
      <DiagnosisWrapper key={`${id}-wrapper`}>
        <Typeahead
          suggestions={suggestions}
          css={codeAdditionalStyles}
          placeholder="Kod"
          data-testid={`${id}-code`}
          disabled={disabled}
          hasValidationError={hasValidationError}
          onSuggestionSelected={onDiagnosisSelected}
          value={code}
          onChange={(event) => {
            const newCode = event.currentTarget.value
            handleUpdate({ ...value, code: newCode, description: newCode === '' ? '' : description }, newCode === '')
            updateTypeaheadResult(newCode.toUpperCase(), true, selectedCodeSystem)
          }}
          onBlur={() => setValue(value)}
          onClose={() => resetDiagnosisTypeahead()}
          moreResults={moreResults}
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
            onChange={(event) => {
              const sanitized = sanitize(event.currentTarget.value)
              handleUpdate({ ...value, code: sanitized === '' ? '' : code, description: sanitized })
              updateTypeaheadResult(sanitized, false, selectedCodeSystem)
            }}
            onClose={() => resetDiagnosisTypeahead()}
            getItemText={getDiagnosisItemText}
            moreResults={moreResults}
            limit={limit}
          />
        </DescriptionAdditional>
        <ValidationErrorWrapper>
          <QuestionValidationTexts validationErrors={validationErrors} />
        </ValidationErrorWrapper>
      </DiagnosisWrapper>
      <InvalidCharactersInfoBox visible={showWarning} />
    </>
  )
}
