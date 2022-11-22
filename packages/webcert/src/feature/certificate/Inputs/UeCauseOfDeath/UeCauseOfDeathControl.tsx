import {
  CertificateDataValidation,
  CertificateDataValidationType,
  ConfigUeDropdownItem,
  ConfigureUeCauseOfDeathControl,
  DatePickerCustom,
  Dropdown,
  getValidDate,
  QuestionValidationTexts,
  TextInput,
  TextValidation,
  ValidationError,
  ValueCauseOfDeath,
} from '@frontend/common'
import { isValid } from 'date-fns'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import { updateClientValidationError } from '../../../../store/certificate/certificateActions'
import { useAppDispatch } from '../../../../store/store'

export interface Props {
  config: ConfigureUeCauseOfDeathControl
  onChange: (value: ValueCauseOfDeath) => void
  disabled?: boolean
  hasValidationError?: boolean
  validationErrors: ValidationError[]
  id: string
  validation: CertificateDataValidation[]
  value: ValueCauseOfDeath
  oneLine?: boolean
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
  children,
  config,
  disabled = false,
  hasValidationError = false,
  id,
  onChange,
  oneLine = false,
  validation,
  validationErrors,
  value,
}) => {
  const dispatch = useAppDispatch()
  const [descriptionValue, setDescriptionValue] = useState(value.description !== undefined ? value.description.text ?? '' : '')
  const [debutValue, setDebutValue] = useState(value.debut !== undefined ? value.debut.date ?? '' : '')
  const [specificationValue, setSpecificationValue] = useState(value.specification !== undefined ? value.specification.code : '')

  const textValidation = validation
    ? (validation.find((v) => v.type === CertificateDataValidationType.TEXT_VALIDATION) as TextValidation)
    : undefined

  const specifications: ConfigUeDropdownItem[] = [{ id: '', label: 'Välj...' }, ...config.specifications]

  const handleValueUpdate = (updatedValue: Partial<ValueCauseOfDeath>) => {
    console.log('change on', value.id)
    onChange({ ...value, ...updatedValue })
  }

  // const handleDescriptionChange = useRef(
  //   _.debounce((text: string) => {
  //     handleValueUpdate({ description: { ...value.description, text } })
  //   }, 1000)
  // ).current

  const handleDescriptionChange = (text: string) => {
    setDescriptionValue(text)
    handleValueUpdate({ description: { ...value.description, text } })
  }

  const handleDateChange = (date: string) => {
    setDebutValue(date)
    if (isValid(getValidDate(date)) || date === '') {
      handleValueUpdate({ debut: { ...value.debut, date } })
    }
  }

  const handleSpecificationChange = (code: string) => {
    setSpecificationValue(code)
    handleValueUpdate({ specification: { ...value.specification, code } })
  }

  const getShouldDisplayValidationErrorOutline = (id: string, field: string) => {
    if (hasValidationError) {
      return true
    }
    if (id) {
      return validationErrors.filter((v: ValidationError) => v.field.includes(field + '.' + id) || v.field.includes('row.' + id)).length > 0
    }
    return validationErrors.length > 0
  }

  const dispatchValidationError = useCallback(
    (shouldBeRemoved: boolean, validationError: ValidationError) => {
      dispatch(updateClientValidationError({ shouldBeRemoved: shouldBeRemoved, validationError: validationError }))
    },
    [dispatch]
  )

  useEffect(() => {
    setDescriptionValue(value.description.text ?? '')
    setDebutValue(value.debut.date ?? '')
    setSpecificationValue(value.specification.code)
  }, [value])

  return (
    <>
      <Wrapper>
        <Description oneLine={oneLine}>
          <TextInputCustomHeight
            label="Beskrivning"
            id={'description_' + config.id}
            value={descriptionValue}
            onChange={(event) => {
              handleDescriptionChange(event.currentTarget.value)
            }}
            disabled={disabled}
            hasValidationError={hasValidationError}
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
              inputString={debutValue}
              disabled={disabled}
              textInputOnChange={handleDateChange}
              setDate={handleDateChange}
              id={`debut${config.id}`}
              questionId={id}
              componentField={`debut.${config.id}`}
              displayValidationErrorOutline={getShouldDisplayValidationErrorOutline(config.id, 'debut')}
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
              value={specificationValue}
              options={specifications.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.label}
                </option>
              ))}
              hasValidationError={hasValidationError}
              height="47px"
            />
          </DateAndSpecInner>
          {children}
        </DateAndSpec>
      </Wrapper>
      <ValidationWrapper>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </ValidationWrapper>
    </>
  )
}

export default UeCauseOfDeathControl
