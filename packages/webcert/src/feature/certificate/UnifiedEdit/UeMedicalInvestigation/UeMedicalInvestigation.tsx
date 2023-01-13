import { Dropdown, TextInput, DatePickerCustom, QuestionValidationTexts } from '@frontend/common'
import {
  ValueMedicalInvestigation,
  ConfigUeCodeItem,
  ConfigUeMedicalInvestigation,
  CertificateDataValidation,
  ValidationError,
  CertificateDataValidationType,
  TextValidation,
} from '@frontend/common/src/types/certificate'
import React, { useCallback } from 'react'
import { updateClientValidationError } from '../../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../../store/store'
import { UeMedicalInvestigationGrid } from './UeMedicalInvestigationGrid'

export interface Props {
  disabled?: boolean
  config: ConfigUeMedicalInvestigation
  questionId: string
  value: ValueMedicalInvestigation
  isShowValidationError: boolean
  validation: CertificateDataValidation[]
  validationErrors: ValidationError[]
  onChange: (value: ValueMedicalInvestigation) => void
}

const UeMedicalInvestigation: React.FC<Props> = ({
  questionId,
  disabled,
  config,
  value,
  isShowValidationError,
  validation,
  validationErrors,
  onChange,
}) => {
  const dispatch = useAppDispatch()
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
        text,
      },
    })
  }

  const dispatchValidationError = useCallback(
    (shouldBeRemoved: boolean, validationError: ValidationError) => {
      dispatch(updateClientValidationError({ shouldBeRemoved, validationError }))
    },
    [dispatch]
  )

  return (
    <>
      <UeMedicalInvestigationGrid>
        <div>
          <Dropdown
            id={config.investigationTypeId}
            label=""
            options={typeOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
            value={value.investigationType.code ?? ''}
            disabled={disabled}
            onChange={(event) => {
              handleInvestigationTypeChange(event.currentTarget.value)
            }}
            hasValidationError={isShowValidationError && validationErrors.some((v) => v.field === config.investigationTypeId)}
          />
        </div>
        <div>
          <DatePickerCustom
            id={config.dateId}
            questionId={questionId}
            forbidFutureDates={true}
            componentField={config.dateId}
            inputString={value.date.date ?? ''}
            textInputOnChange={handleDateChange}
            disabled={disabled}
            setDate={handleDateChange}
            displayValidationErrorOutline={isShowValidationError && validationErrors.some((v) => v.field === config.dateId)}
            onDispatchValidationError={dispatchValidationError}
          />
        </div>
        <div>
          <TextInput
            onChange={(event) => {
              handleInformationSourceChange(event.currentTarget.value)
            }}
            id={config.informationSourceId}
            hasValidationError={isShowValidationError && validationErrors.some((v) => v.field === config.informationSourceId)}
            value={value.informationSource.text ?? ''}
            limit={textValidation ? textValidation.limit : 100}
            disabled={disabled}
          />
        </div>
      </UeMedicalInvestigationGrid>
      {isShowValidationError && <QuestionValidationTexts validationErrors={validationErrors} />}
    </>
  )
}

export default UeMedicalInvestigation
