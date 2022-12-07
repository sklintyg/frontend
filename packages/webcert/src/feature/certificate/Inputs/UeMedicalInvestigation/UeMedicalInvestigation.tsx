import { Dropdown, TextInput, DatePickerCustom } from '@frontend/common'
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

  const typeOptions: ConfigUeCodeItem[] = [{ id: '', label: 'Välj...', code: null }, ...config.typeOptions]

  const handleInvestigationTypeChange = (code: string) => {
    const investigationTypeId = config.typeOptions.find((s) => s.code === code)?.id ?? null
    const investigationTypeCode = config.typeOptions.find((s) => s.code === code)?.code ?? null
    onChange({ ...value, investigationType: { ...value.investigationType, id: investigationTypeId, code: investigationTypeCode } })
  }

  const handleDateChange = (date: string) => {
    onChange({ ...value, date: { ...value.date, date } })
  }

  const handleInformationSourceChange = (text: string) => {
    onChange({ ...value, informationSource: { ...value.informationSource, text } })
  }

  const dispatchValidationError = useCallback(
    (shouldBeRemoved: boolean, validationError: ValidationError) => {
      dispatch(updateClientValidationError({ shouldBeRemoved, validationError }))
    },
    [dispatch]
  )

  return (
    <>
      <div className="iu-grid-cols">
        <div>
          <Dropdown
            id={config.investigationTypeId}
            label=""
            options={
              typeOptions &&
              typeOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))
            }
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
            inputString={value.date.date ?? ''}
            textInputOnChange={handleDateChange}
            disabled={disabled}
            setDate={(date: string) => {
              handleDateChange(date)
            }}
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
        {/* {isShowValidationError && (
          <ValidationWrapper>
            <QuestionValidationTexts validationErrors={question.validationErrors} />
          </ValidationWrapper>
        )}{' '} */}
      </div>
    </>
  )
}

export default UeMedicalInvestigation
