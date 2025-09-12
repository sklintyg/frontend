import { useState } from 'react'
import styled from 'styled-components'
import RadioButton from '../../../../components/Inputs/RadioButton'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'
import { useAppSelector } from '../../../../store/store'
import type { ConfigUeDiagnoses, TextValidation, ValueDiagnosis, ValueDiagnosisList } from '../../../../types'
import { CertificateDataValidationType, CertificateDataValueType } from '../../../../types'
import type { UnifiedEdit } from '../UnifiedEdit'
import { useDiagnosisTypeahead } from './hooks/useDiagnosisTypeahead'
import { UeDiagnosis } from './UeDiagnosis'

const RadioWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 0.9375rem;

  div {
    padding-right: 0.9375rem;
  }
`

export function UeDiagnoses({
  question: { id, config, value, validation },
  disabled,
  onUpdate,
}: UnifiedEdit<ConfigUeDiagnoses, ValueDiagnosisList>) {
  const [list, setList] = useState(value.list)
  const firstSavedItem = value.list.find((value) => value && value.terminology !== '')
  const [selectedCodeSystem, setSelectedCodeSystem] = useState(
    value.list.length > 0 && firstSavedItem ? firstSavedItem.terminology : config.terminology[0].id
  )
  const fields = config.list.map(({ id }) => id)
  const validationErrors = useAppSelector(getVisibleValidationErrors(id))
  const validationErrorsWithMissingField = validationErrors.filter(({ field }) => !fields.includes(field))
  const textValidation = validation
    ? (validation.find((v) => v.type === CertificateDataValidationType.TEXT_VALIDATION) as TextValidation)
    : undefined

  const typeaheadProps = useDiagnosisTypeahead({ list })

  function onListUpdate(list: ValueDiagnosis[]) {
    setList(list)
    onUpdate({ ...value, list })
  }

  return (
    <>
      {config.terminology.length > 1 && (
        <>
          <p>Välj kodverk:</p>
          <RadioWrapper>
            {config.terminology.map(({ id, label }) => {
              return (
                <RadioButton
                  key={id}
                  disabled={disabled}
                  label={label}
                  name={id}
                  id={id}
                  value={id}
                  checked={selectedCodeSystem === id}
                  onChange={(event) => {
                    onListUpdate([])
                    setSelectedCodeSystem(event.currentTarget.name)
                  }}
                />
              )
            })}
          </RadioWrapper>
        </>
      )}
      <p className="iu-mb-200">Diagnoskod enligt {config.terminology.find(({ id }) => id === selectedCodeSystem)?.label}</p>

      {config.list.map(({ id }, index) => {
        const diagnosisValidationErrors = validationErrors.filter(({ field }) => field === id)
        return (
          <UeDiagnosis
            key={id}
            id={id}
            value={
              list.find((item) => item.id === id) ?? {
                type: CertificateDataValueType.DIAGNOSIS,
                id: id,
                terminology: selectedCodeSystem,
                code: '',
                description: '',
              }
            }
            limit={textValidation?.limit}
            disabled={disabled}
            hasValidationError={(index === 0 && validationErrorsWithMissingField.length > 0) || diagnosisValidationErrors.length > 0}
            validationErrors={diagnosisValidationErrors}
            selectedCodeSystem={selectedCodeSystem}
            onChange={(changedItem) => {
              const updatedList = list.filter((item) => item.id !== changedItem.id).concat(changedItem)
              onListUpdate(updatedList)
            }}
            {...typeaheadProps}
          />
        )
      })}

      {validationErrorsWithMissingField.length > 0 && <QuestionValidationTexts validationErrors={validationErrorsWithMissingField} />}
    </>
  )
}
