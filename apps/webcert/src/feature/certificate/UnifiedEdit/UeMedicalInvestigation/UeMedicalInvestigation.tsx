import { getByType } from '@frontend/utils'
import { fromUnixTime } from 'date-fns'
import styled from 'styled-components'
import DatePickerCustom from '../../../../components/Inputs/DatePickerCustom/DatePickerCustom'
import Dropdown from '../../../../components/Inputs/Dropdown'
import TextInput from '../../../../components/Inputs/TextInput'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import { getQuestionExpressionResult } from '../../../../store/certificate/certificateSelectors'
import { useAppSelector } from '../../../../store/store'
import type {
  CertificateDataValidation,
  ConfigUeCodeItem,
  ConfigUeMedicalInvestigation,
  ConfigUeMedicalInvestigationList,
  ValidationError,
  ValueMedicalInvestigation,
} from '../../../../types'
import { CertificateDataValidationType, CertificateDataValueType } from '../../../../types'
import { formatDateToString } from '../../../../utils'

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  &:not(:last-child) {
    padding-bottom: 0.9375rem;
  }
`

const Root = styled.div`
  &:not(:last-child) {
    padding-bottom: 1.25rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
`

export function UeMedicalInvestigation({
  disabled,
  config,
  questionConfig,
  value: incomingValue,
  validation,
  validationErrors,
  error,
  onChange,
}: {
  disabled?: boolean
  config: ConfigUeMedicalInvestigation
  questionConfig: ConfigUeMedicalInvestigationList
  value?: ValueMedicalInvestigation
  validation: CertificateDataValidation[]
  validationErrors: ValidationError[]
  error: boolean
  onChange: (value: ValueMedicalInvestigation) => void
}) {
  const maxDateValidation = getByType(validation, CertificateDataValidationType.MAX_DATE_VALIDATION)
  const minDateValidation = getByType(validation, CertificateDataValidationType.MIN_DATE_VALIDATION)
  const textValidation = getByType(validation, CertificateDataValidationType.TEXT_VALIDATION)
  const maxDate = useAppSelector(
    maxDateValidation && maxDateValidation.id === config.dateId
      ? getQuestionExpressionResult(maxDateValidation.questionId, maxDateValidation.expression)
      : () => config.maxDate
  )
  const minDate = useAppSelector(
    minDateValidation && minDateValidation.id === config.dateId
      ? getQuestionExpressionResult(minDateValidation.questionId, minDateValidation.expression)
      : () => config.minDate
  )

  const value: ValueMedicalInvestigation = incomingValue ?? {
    type: CertificateDataValueType.MEDICAL_INVESTIGATION,
    date: {
      type: CertificateDataValueType.DATE,
      id: config.dateId,
    },
    informationSource: {
      type: CertificateDataValueType.TEXT,
      id: config.informationSourceId,
    },
    investigationType: {
      type: CertificateDataValueType.CODE,
      id: config.investigationTypeId,
    },
  }

  const typeOptions: ConfigUeCodeItem[] = [{ id: '', label: 'Välj...', code: '' }, ...config.typeOptions]

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

  const typeErrors = validationErrors.filter((v) => v.field === config.investigationTypeId)
  const dateErrors = validationErrors.filter((v) => v.field === config.dateId)
  const informationSourceErrors = validationErrors.filter((v) => v.field === config.informationSourceId)

  return (
    <Root>
      <div>
        <Row>
          <div style={{ width: '100%' }}>
            <Dropdown
              label={questionConfig.typeText}
              id={config.investigationTypeId}
              value={value.investigationType.code ?? ''}
              title={typeOptions.find((item) => item.code === value.investigationType.code)?.label}
              disabled={disabled}
              onChange={(event) => {
                onChange({
                  ...value,
                  investigationType: {
                    ...value.investigationType,
                    id: config.investigationTypeId,
                    code: event.currentTarget.value,
                  },
                })
              }}
              error={error || typeErrors.length > 0}
              fullWidth={true}
            >
              {typeOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </Dropdown>
            <QuestionValidationTexts validationErrors={typeErrors} />
          </div>
          <div style={{ minWidth: '201px' }}>
            <label htmlFor={config.dateId}>{questionConfig.dateText}</label>
            <DatePickerCustom
              id={config.dateId}
              max={typeof maxDate === 'number' ? formatDateToString(fromUnixTime(maxDate)) : config.maxDate}
              min={typeof minDate === 'number' ? formatDateToString(fromUnixTime(minDate)) : config.minDate}
              inputString={value.date.date ?? ''}
              textInputOnChange={handleDateChange}
              disabled={disabled}
              setDate={handleDateChange}
              displayValidationErrorOutline={error || dateErrors.length > 0}
            />
            <QuestionValidationTexts validationErrors={dateErrors} />
          </div>
        </Row>
        <div>
          <TextInput
            label={questionConfig.informationSourceText}
            onChange={(event) => {
              onChange({
                ...value,
                informationSource: {
                  ...value.informationSource,
                  id: config.informationSourceId,
                  text: event.currentTarget.value || null,
                },
              })
            }}
            id={config.informationSourceId}
            hasValidationError={error || informationSourceErrors.length > 0}
            value={value.informationSource.text ?? ''}
            limit={textValidation ? textValidation.limit : 100}
            disabled={disabled}
            tooltip={questionConfig.informationSourceDescription}
          />
          <QuestionValidationTexts validationErrors={informationSourceErrors} />
        </div>
      </div>
    </Root>
  )
}
