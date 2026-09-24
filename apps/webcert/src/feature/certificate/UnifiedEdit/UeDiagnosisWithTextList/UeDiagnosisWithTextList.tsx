import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import RadioButton from '../../../../components/Inputs/RadioButton'
import TextInput from '../../../../components/Inputs/TextInput'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppSelector } from '../../../../store/store'
import type {
  ConfigUeDiagnosesWithText,
  ValidationError,
  ValueDiagnosisWithText,
  ValueDiagnosisWithTextList,
  ValueText,
} from '../../../../types'
import { CertificateDataValueType } from '../../../../types'
import InvalidCharactersInfoBox from '../InvalidCharactersInfoBox'
import { useDiagnosisTypeahead } from '../UeDiagnosis/hooks/useDiagnosisTypeahead'
import { UeDiagnosis } from '../UeDiagnosis/UeDiagnosis'
import useIso8859Sanitization from '../hooks/useIso8859Sanitization'
import type { UnifiedEdit } from '../UnifiedEdit'

const RadioWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 0.9375rem;

  div {
    padding-right: 0.9375rem;
  }
`

const Row = styled.div`
  &:not(:last-child) {
    padding-bottom: 1.25rem;
    margin-bottom: 1.25rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
`

/** One entry per configured row, in config order; a row the value lacks gets empty leaves. */
function toRows(config: ConfigUeDiagnosesWithText, value: ValueDiagnosisWithTextList, terminology: string): ValueDiagnosisWithText[] {
  return config.list.map((row) => {
    const saved = value.list.find((item) => item.id === row.id)
    return {
      type: CertificateDataValueType.DIAGNOSIS_WITH_TEXT,
      id: row.id,
      diagnosis: {
        type: CertificateDataValueType.DIAGNOSIS,
        id: row.diagnosisId,
        terminology: saved?.diagnosis.terminology || terminology,
        code: saved?.diagnosis.code ?? '',
        description: saved?.diagnosis.description ?? '',
      },
      text: {
        type: CertificateDataValueType.TEXT,
        id: row.textId,
        text: saved?.text.text ?? null,
      },
    }
  })
}

function UeDiagnosisText({
  id,
  value,
  label,
  limit,
  disabled,
  validationErrors,
  onChange,
}: {
  id: string
  value: ValueText
  label: string
  limit: number
  disabled: boolean
  validationErrors: ValidationError[]
  onChange: (value: ValueText) => void
}) {
  const rawInitialText = value.text ?? ''
  const { sanitize, showWarning, sanitizedInitialValue } = useIso8859Sanitization(rawInitialText)

  useEffect(() => {
    if (!disabled && sanitizedInitialValue !== rawInitialText) {
      onChange({ ...value, text: sanitizedInitialValue || null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="iu-mt-300" data-testid={`${id}-container`}>
      <TextInput
        id={id}
        label={label}
        value={value.text ?? ''}
        limit={limit}
        disabled={disabled}
        hasValidationError={validationErrors.length > 0}
        onChange={(event) => {
          onChange({ ...value, text: sanitize(event.currentTarget.value) || null })
        }}
      />
      <QuestionValidationTexts validationErrors={validationErrors} />
      <InvalidCharactersInfoBox visible={showWarning} />
    </div>
  )
}

export function UeDiagnosisWithTextList({
  question: { id, config, value },
  disabled,
  onUpdate,
}: UnifiedEdit<ConfigUeDiagnosesWithText, ValueDiagnosisWithTextList>) {
  const firstSavedTerminology = value.list.find(({ diagnosis }) => diagnosis.code && diagnosis.terminology)?.diagnosis.terminology
  const [selectedCodeSystem, setSelectedCodeSystem] = useState(firstSavedTerminology ?? config.terminology[0].id)
  const [list, setList] = useState(() => toRows(config, value, selectedCodeSystem))
  // Rows may report in the same tick (the sanitising effects on mount), so updates build on the latest list, not the rendered one.
  const latestList = useRef(list)
  const fields = config.list.flatMap(({ diagnosisId, textId }) => [diagnosisId, textId])
  const validationErrors = useAppSelector(getVisibleValidationErrors(id))
  const validationErrorsWithMissingField = validationErrors.filter(({ field }) => !fields.includes(field))

  const diagnoses = useMemo(() => list.map(({ diagnosis }) => diagnosis), [list])
  const typeaheadProps = useDiagnosisTypeahead({ list: diagnoses })

  function onListUpdate(updatedList: ValueDiagnosisWithText[]) {
    latestList.current = updatedList
    setList(updatedList)
    onUpdate({ ...value, list: updatedList })
  }

  function onRowUpdate(rowId: string, change: Partial<Pick<ValueDiagnosisWithText, 'diagnosis' | 'text'>>) {
    onListUpdate(latestList.current.map((row) => (row.id === rowId ? { ...row, ...change } : row)))
  }

  return (
    <>
      {config.terminology.length > 1 && (
        <>
          <p>Välj kodverk:</p>
          <RadioWrapper>
            {config.terminology.map((terminology) => (
              <RadioButton
                key={terminology.id}
                disabled={disabled}
                label={terminology.label}
                name={terminology.id}
                id={terminology.id}
                value={terminology.id}
                checked={selectedCodeSystem === terminology.id}
                onChange={(event) => {
                  const codeSystem = event.currentTarget.name
                  setSelectedCodeSystem(codeSystem)
                  onListUpdate(
                    latestList.current.map((row) => ({
                      ...row,
                      diagnosis: { ...row.diagnosis, terminology: codeSystem, code: '', description: '' },
                    }))
                  )
                }}
              />
            ))}
          </RadioWrapper>
        </>
      )}
      <p className="iu-mb-200">
        Diagnoskod enligt {config.terminology.find((terminology) => terminology.id === selectedCodeSystem)?.label}
      </p>

      {config.list.map((rowConfig, index) => {
        const row = list[index]
        const diagnosisValidationErrors = validationErrors.filter(({ field }) => field === rowConfig.diagnosisId)
        return (
          <Row key={rowConfig.id} data-testid={rowConfig.id}>
            <UeDiagnosis
              key={`${rowConfig.diagnosisId}-${selectedCodeSystem}`}
              id={rowConfig.diagnosisId}
              value={row.diagnosis}
              disabled={disabled}
              hasValidationError={(index === 0 && validationErrorsWithMissingField.length > 0) || diagnosisValidationErrors.length > 0}
              validationErrors={diagnosisValidationErrors}
              selectedCodeSystem={selectedCodeSystem}
              onChange={(diagnosis) => onRowUpdate(rowConfig.id, { diagnosis })}
              {...typeaheadProps}
            />
            <UeDiagnosisText
              id={rowConfig.textId}
              value={row.text}
              label={config.textLabel}
              limit={config.textLimit}
              disabled={disabled}
              validationErrors={validationErrors.filter(({ field }) => field === rowConfig.textId)}
              onChange={(text) => onRowUpdate(rowConfig.id, { text })}
            />
          </Row>
        )
      })}

      {validationErrorsWithMissingField.length > 0 && <QuestionValidationTexts validationErrors={validationErrorsWithMissingField} />}
    </>
  )
}
