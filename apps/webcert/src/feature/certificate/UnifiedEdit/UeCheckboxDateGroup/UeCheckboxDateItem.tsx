import { format } from 'date-fns'
import styled from 'styled-components'
import Checkbox from '../../../../components/Inputs/Checkbox'
import DatePickerCustom from '../../../../components/Inputs/DatePickerCustom/DatePickerCustom'
import QuestionValidationTexts from '../../../../components/Validation/QuestionValidationTexts'
import type { ValidationError, ValueDate } from '../../../../types'
import { _format } from '../../../../utils'

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  :not(:last-child) {
    padding-bottom: 0.9375rem;
  }
`

const ValidationWrapper = styled.div`
  flex: 0 !important;
  flex-basis: 100% !important;
  margin-top: 0;
`

export const UeCheckboxDateItem = ({
  value,
  onChange,
  disabled,
  validationErrors,
  hasValidationError,
  maxDate,
  minDate,
  label,
  id,
}: {
  value: ValueDate
  onChange: (val: ValueDate) => void
  disabled: boolean
  validationErrors: ValidationError[]
  hasValidationError: boolean
  maxDate?: string
  minDate?: string
  label: string
  id: string
}) => {
  const handleDatepickerChange = (date: string) => onChange({ ...value, date })

  return (
    <Wrapper>
      <Checkbox
        id={`checkbox_${id}`}
        label={label}
        checked={value.date ? value.date.length > 0 : false}
        vertical={true}
        disabled={disabled}
        onChange={(event) => {
          onChange({ ...value, date: event.target.checked ? format(new Date(), _format) : undefined })
        }}
        hasValidationError={hasValidationError}
      />
      <DatePickerCustom
        disabled={disabled}
        textInputOnChange={handleDatepickerChange}
        setDate={handleDatepickerChange}
        inputString={value.date ? value.date : null}
        displayValidationErrorOutline={hasValidationError || validationErrors.length > 0}
        max={maxDate}
        min={minDate}
      />
      <ValidationWrapper>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </ValidationWrapper>
    </Wrapper>
  )
}
