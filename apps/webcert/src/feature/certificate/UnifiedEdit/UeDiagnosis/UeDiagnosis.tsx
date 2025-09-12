import React from 'react'
import styled, { css } from 'styled-components'
import Typeahead from '../../../../components/Inputs/Typeahead'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import type { ValidationError, ValueDiagnosis } from '../../../../types'
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
  const { code, description } = value

  const codeInput = React.createRef<HTMLInputElement>()

  const onDiagnosisSelected = (diagnosis: string) => {
    const { code, description } = getDiagnosisParts(diagnosis)
    resetDiagnosisTypeahead()
    onChange({ ...value, code, description })
  }

  return (
    <DiagnosisWrapper key={`${id}-wrapper`}>
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
        onChange={(event) => {
          const newCode = event.currentTarget.value
          onChange({ ...value, code: newCode, description: newCode === '' ? '' : description })
          updateTypeaheadResult(newCode.toUpperCase(), true, selectedCodeSystem)
        }}
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
            const newDescription = event.currentTarget.value
            onChange({ ...value, code: newDescription === '' ? '' : code, description: newDescription })
            updateTypeaheadResult(newDescription, false, selectedCodeSystem)
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
  )
}
