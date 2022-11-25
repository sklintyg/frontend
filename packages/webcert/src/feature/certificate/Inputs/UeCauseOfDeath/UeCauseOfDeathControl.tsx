import {
  CertificateDataValidation,
  CertificateDataValidationType,
  ConfigUeDropdownItem,
  ConfigureUeCauseOfDeathControl,
  DatePickerCustom,
  Dropdown,
  QuestionValidationTexts,
  TextInput,
  TextValidation,
  ValidationError,
  ValueCauseOfDeath,
} from '@frontend/common'
import React, { useCallback } from 'react'
import styled from 'styled-components/macro'
import { updateClientValidationError } from '../../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../../store/store'

export interface Props {
  config: ConfigureUeCauseOfDeathControl
  disabled?: boolean
  isShowValidationError: boolean
  questionId: string
  onChange: (value: ValueCauseOfDeath) => void
  oneLine?: boolean
  validation: CertificateDataValidation[]
  validationErrors: ValidationError[]
  value: ValueCauseOfDeath
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto max-content;
  grid-column-gap: 20px;
`

const ValidationWrapper = styled.div`
  flex: 0 !important;
  flex-basis: 100% !important;
  padding-bottom: 16px;
  margin-top: 0;
`
const Description = styled.div<{ oneLine: boolean }>`
  grid-column: ${(props) => (props.oneLine ? 1 : 1 / 2)};
  grid-row: 1;
`

const DateAndSpec = styled.div<{ oneLine: boolean }>`
  display: flex;
  grid-column: ${(props) => (props.oneLine ? 2 : 1)};
  grid-row: ${(props) => (props.oneLine ? 1 : 2)};
`

const DateAndSpecInner = styled.div`
  min-width: 25ch;
`

const TextInputCustomHeight = styled(TextInput)`
  height: 47px;
  margin-bottom: 15px;
`

const UeCauseOfDeathControl: React.FC<Props> = ({
  questionId,
  value,
  config,
  disabled = false,
  oneLine = false,
  children,
  onChange,
  validation,
  validationErrors,
  isShowValidationError,
}) => {
  const dispatch = useAppDispatch()
  const textValidation = validation
    ? (validation.find((v) => v.type === CertificateDataValidationType.TEXT_VALIDATION) as TextValidation)
    : undefined

  const specifications: ConfigUeDropdownItem[] = [{ id: '', label: 'Välj...' }, ...config.specifications]

  const handleDescriptionChange = (text: string) => {
    onChange({ ...value, description: { ...value.description, text } })
  }

  const handleDateChange = (date: string) => {
    // if (isValid(getValidDate(date)) || date === '') {
    //   onChange({ ...value, debut: { ...value.debut, date } })
    // }
    onChange({ ...value, debut: { ...value.debut, date } })
  }

  const handleSpecificationChange = (code: string) => {
    onChange({ ...value, debut: { ...value.specification, code } })
  }

  const dispatchValidationError = useCallback(
    (shouldBeRemoved: boolean, validationError: ValidationError) => {
      dispatch(updateClientValidationError({ shouldBeRemoved, validationError }))
    },
    [dispatch]
  )

  return (
    <>
      <Wrapper>
        <Description oneLine={oneLine}>
          <TextInputCustomHeight
            label="Beskrivning"
            id={config.descriptionId}
            value={value.description.text ?? ''}
            onChange={(event) => {
              handleDescriptionChange(event.currentTarget.value)
            }}
            disabled={disabled}
            hasValidationError={isShowValidationError && validationErrors.some((v) => v.field === config.descriptionId)}
            limit={textValidation ? textValidation.limit : 100}
          />
        </Description>
        <DateAndSpec oneLine={oneLine}>
          <DateAndSpecInner>
            <DatePickerCustom
              additionalStyles="iu-mr-500"
              label="Ungefärlig debut"
              forbidFutureDates={true}
              vertical={true}
              inputString={value.debut.date ?? ''}
              disabled={disabled}
              textInputOnChange={handleDateChange}
              setDate={handleDateChange}
              id={config.debutId}
              questionId={questionId}
              componentField={config.debutId}
              displayValidationErrorOutline={isShowValidationError && validationErrors.some((v) => v.field === config.debutId)}
              onDispatchValidationError={dispatchValidationError}
            />
          </DateAndSpecInner>
          <DateAndSpecInner>
            <Dropdown
              label="Specificera tillståndet"
              id={'specification_' + config.id}
              onChange={(event) => {
                handleSpecificationChange(event.currentTarget.value)
              }}
              disabled={disabled}
              value={value.specification.code}
              options={specifications.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.label}
                </option>
              ))}
              hasValidationError={false}
              height="47px"
            />
          </DateAndSpecInner>
          {children}
        </DateAndSpec>
      </Wrapper>
      {isShowValidationError && (
        <ValidationWrapper>
          <QuestionValidationTexts validationErrors={validationErrors} />
        </ValidationWrapper>
      )}
    </>
  )
}

export default UeCauseOfDeathControl
