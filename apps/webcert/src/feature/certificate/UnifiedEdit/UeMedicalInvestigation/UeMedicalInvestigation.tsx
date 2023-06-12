import {
  CertificateDataValidation,
  CertificateDataValidationType,
  ConfigUeCodeItem,
  ConfigUeMedicalInvestigation,
  DatePickerCustom,
  Dropdown,
  QuestionValidationTexts,
  TextInput,
  TextValidation,
  ValidationError,
  ValueMedicalInvestigation,
} from '@frontend/common'
import React from 'react'
import { UeMedicalInvestigationGrid } from './UeMedicalInvestigationGrid'

export interface Props {
  disabled?: boolean
  config: ConfigUeMedicalInvestigation
  value: ValueMedicalInvestigation
  validation: CertificateDataValidation[]
  validationErrors: ValidationError[]
  error: boolean
  onChange: (value: ValueMedicalInvestigation) => void
}

const UeMedicalInvestigation: React.FC<Props> = ({ disabled, config, value, validation, validationErrors, error, onChange }) => {
  const textValidation = validation
    ? (validation.find((v) => v.type === CertificateDataValidationType.TEXT_VALIDATION) as TextValidation)
    : undefined

  const typeOptions: ConfigUeCodeItem[] = [{ id: '', label: 'Välj...', code: '' }, ...config.typeOptions]

  const handleInvestigationTypeChange = (code: string) => {
    onChange({
      ...value,
      investigationType: {
        ...value.investigationType,
        id: config.investigationTypeId,
        code: code,
      },
    })
  }

  const handleDateChange = (date: string) => {
    onChange({
      ...value,
      date: {
        ...value.date,
        id: config.dateId,
        date,
      },
    })
  }

  const handleInformationSourceChange = (text: string) => {
    onChange({
      ...value,
      informationSource: {
        ...value.informationSource,
        id: config.informationSourceId,
        text: text || null,
      },
    })
  }
  return (
    <>
      <UeMedicalInvestigationGrid>
        <div>
          <Dropdown
            id={config.investigationTypeId}
            value={value.investigationType.code ?? ''}
            title={typeOptions.find((item) => item.code === value.investigationType.code)?.label}
            disabled={disabled}
            onChange={(event) => {
              handleInvestigationTypeChange(event.currentTarget.value)
            }}
            error={error || validationErrors.some((v) => v.field === config.investigationTypeId)}
          >
            {typeOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </Dropdown>
        </div>
        <div>
          <DatePickerCustom
            id={config.dateId}
            max={config.maxDate}
            min={config.minDate}
            inputString={value.date.date ?? ''}
            textInputOnChange={handleDateChange}
            disabled={disabled}
            setDate={handleDateChange}
            displayValidationErrorOutline={error || validationErrors.some((v) => v.field === config.dateId)}
          />
        </div>
        <div>
          <TextInput
            onChange={(event) => {
              handleInformationSourceChange(event.currentTarget.value)
            }}
            id={config.informationSourceId}
            hasValidationError={error || validationErrors.some((v) => v.field === config.informationSourceId)}
            value={value.informationSource.text ?? ''}
            limit={textValidation ? textValidation.limit : 100}
            disabled={disabled}
          />
        </div>
      </UeMedicalInvestigationGrid>
      <QuestionValidationTexts validationErrors={validationErrors} />
    </>
  )
}

export default UeMedicalInvestigation
