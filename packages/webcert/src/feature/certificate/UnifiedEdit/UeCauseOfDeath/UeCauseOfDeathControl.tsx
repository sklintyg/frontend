import {
  CertificateDataValidation,
  CertificateDataValidationType,
  ConfigUeCauseOfDeathControl,
  ConfigUeCodeItem,
  DatePickerCustom,
  Dropdown,
  QuestionValidationTexts,
  TextInput,
  TextValidation,
  ValidationError,
  ValueCauseOfDeath,
} from '@frontend/common'
import React from 'react'
import styled from 'styled-components'

export interface Props {
  config: ConfigUeCauseOfDeathControl
  disabled?: boolean
  onChange: (value: ValueCauseOfDeath) => void
  oneLine?: boolean
  validation: CertificateDataValidation[]
  validationErrors: ValidationError[]
  value: ValueCauseOfDeath
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto max-content;
  grid-column-gap: 0.9375rem;
`

const ValidationWrapper = styled.div`
  flex: 0 !important;
  flex-basis: 100% !important;
  margin-top: 0;
`
const EmptyValidationWrapper = styled.div`
  grid-column: 1 / 2;
  grid-row: 2;
`
const Description = styled.div<{ oneLine: boolean }>`
  grid-column: ${(props) => (props.oneLine ? 1 : 1 / 2)};
  grid-row: 1;
`

const DateAndSpec = styled.div<{ oneLine: boolean }>`
  display: flex;
  grid-column: ${(props) => (props.oneLine ? 2 : 1)};
  grid-row: ${(props) => (props.oneLine ? 1 : 3)};
`

const DateAndSpecInner = styled.div`
  min-width: 22ch;
`

const UeCauseOfDeathControl: React.FC<Props> = ({
  value,
  config,
  disabled = false,
  oneLine = false,
  children,
  onChange,
  validation,
  validationErrors,
}) => {
  const textValidation = validation
    ? (validation.find((v) => v.type === CertificateDataValidationType.TEXT_VALIDATION) as TextValidation)
    : undefined

  const emptyValidationError = validationErrors.filter((e) => e.type === 'EMPTY')
  const nonEmptyValidationErrors = validationErrors.filter((e) => e.type !== 'EMPTY')

  const specifications: ConfigUeCodeItem[] = [{ id: '', code: '', label: 'Välj...' }, ...config.specifications]

  const handleDescriptionChange = (text: string) => {
    onChange({ ...value, description: { ...value.description, text } })
  }

  const handleDateChange = (date: string) => {
    onChange({ ...value, debut: { ...value.debut, date } })
  }

  const handleSpecificationChange = (code: string) => {
    const specificationId = config.specifications.find((s) => s.code === code)?.id ?? ''
    onChange({ ...value, specification: { ...value.specification, id: specificationId, code: code } })
  }

  return (
    <>
      <Wrapper className={`${oneLine ? 'iu-mb-400' : ''}`}>
        <Description oneLine={oneLine}>
          <TextInput
            label="Beskrivning"
            id={config.descriptionId}
            value={value.description.text ?? ''}
            onChange={(event) => {
              handleDescriptionChange(event.currentTarget.value)
            }}
            disabled={disabled}
            hasValidationError={emptyValidationError.length > 0}
            limit={textValidation ? textValidation.limit : 100}
          />
        </Description>
        {emptyValidationError.length > 0 && (
          <EmptyValidationWrapper>
            <ValidationWrapper>
              <QuestionValidationTexts validationErrors={emptyValidationError} />
            </ValidationWrapper>
          </EmptyValidationWrapper>
        )}
        <DateAndSpec oneLine={oneLine} className={`${!oneLine ? 'iu-mt-400' : ''}`}>
          <DateAndSpecInner>
            <DatePickerCustom
              additionalStyles="iu-mr-400"
              label="Ungefärlig debut"
              max={config.maxDate}
              min={config.minDate}
              vertical={true}
              inputString={value.debut.date ?? ''}
              disabled={disabled}
              textInputOnChange={handleDateChange}
              setDate={handleDateChange}
              id={config.debutId}
              displayValidationErrorOutline={validationErrors.some((v) => v.field.endsWith('.datum'))}
            />
          </DateAndSpecInner>
          <DateAndSpecInner>
            <Dropdown
              label="Specificera tillståndet"
              id={`specification_${config.id}`}
              onChange={(event) => {
                handleSpecificationChange(event.currentTarget.value)
              }}
              disabled={disabled}
              value={value.specification.code}
              error={false}>
              {specifications.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.label}
                </option>
              ))}
            </Dropdown>
          </DateAndSpecInner>
          {children}
        </DateAndSpec>
      </Wrapper>
      {nonEmptyValidationErrors.length > 0 && (
        <ValidationWrapper>
          <QuestionValidationTexts validationErrors={nonEmptyValidationErrors} />
        </ValidationWrapper>
      )}
    </>
  )
}

export default UeCauseOfDeathControl
