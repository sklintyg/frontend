import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format, isValid, parse } from 'date-fns'
import styled from 'styled-components/macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarWeek } from '@fortawesome/free-solid-svg-icons'
import { formatDateToString, getValidDate, QuestionValidationTexts } from '@frontend/common'

const Wrapper = styled.div`
  display: flex;
`

const StyledButton = styled.button<inputProps>`
  padding: 8px !important;
  min-width: 0;
  box-shadow: none;
  border: ${(props) => (props.displayValidationError ? '1px solid #c12143 !important' : '1px solid rgba(0; 0; 0; 0.23)')};
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: 0 !important;
`

interface inputProps {
  displayValidationError: boolean | undefined
}

const TextInput = styled.input<inputProps>`
  padding: 0 0.5rem !important;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  max-width: 13ch;
  border: ${(props) => (props.displayValidationError ? '1px solid #c12143 !important' : '')};
  border-right: 0 !important;
`

const ValidationWrapper = styled.div`
  flex-basis: 100%;
`

interface Props {
  disabled?: boolean
  label?: string
  setDate: (date: string) => void
  inputString: string | null
  textInputOnChange: (value: string) => void
  textInputOnBlur?: React.FocusEventHandler<HTMLInputElement>
  textInputOnKeyDown?: (event: React.KeyboardEvent) => void
  id?: string
  textInputName?: string
  textInputRef?: ((instance: HTMLInputElement | null) => void) | React.RefObject<HTMLInputElement> | null | undefined
  textInputDataTestId?: string
  displayValidationErrorOutline?: boolean
}

const _dateReg = /[1-2][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/
const _dateRegDashesOptional = /[1-2][0-9]{3}-?(0[1-9]|1[0-2])-?(0[1-9]|[1-2][0-9]|3[0-1])/
const _format = 'yyyy-MM-dd'
const INVALID_DATE_FORMAT_ERROR = 'Ange datum i formatet åååå-mm-dd.'
const InvalidDateFormatValidationMessage = [{ category: '', field: '', id: '', text: INVALID_DATE_FORMAT_ERROR, type: '' }]

const DatePickerCustom: React.FC<Props> = ({
  label,
  setDate,
  inputString,
  textInputOnChange,
  id,
  textInputOnBlur,
  textInputRef,
  textInputOnKeyDown,
  textInputName,
  textInputDataTestId,
  displayValidationErrorOutline,
  disabled,
}) => {
  const [open, setOpen] = useState(false)
  const [displayFormattingError, setDisplayFormattingError] = useState(false)

  let date: Date

  useEffect(() => {
    if (isValueFormatIncorrect(inputString)) {
      updateFormattingValidation(inputString)
    }
  }, [])

  useEffect(() => {
    if (displayFormattingError) {
      updateFormattingValidation(inputString)
    }
  }, [inputString])

  const getValidDateForPicker = (dateString: string) => {
    if (_dateReg.test(dateString)) {
      const formattedString = dateString.replace(/-/g, '')
      return parse(formattedString, 'yyyyMMdd', new Date())
    } else if (_dateRegDashesOptional.test(dateString)) {
      return parse(dateString, 'yyyyMMdd', new Date())
    }

    return new Date()
  }

  if (inputString) {
    date = getValidDateForPicker(inputString)
  } else {
    date = new Date()
  }

  const handleTextInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value

    const updatedFromDate = getValidDate(value)

    if (isValid(updatedFromDate)) {
      const dateString = formatDateToString(updatedFromDate!)
      value = dateString
    }
    textInputOnChange(value)
  }

  const handleTextInputOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    updateFormattingValidation(inputString)
    textInputOnBlur?.(event)
  }

  const handleDateOnSelect = (date: Date) => {
    const dateString = formatDateToString(date)
    setDate(dateString)
  }

  const updateFormattingValidation = (value: string | null) => {
    if (isValueFormatIncorrect(value)) {
      setDisplayFormattingError(true)
    } else {
      setDisplayFormattingError(false)
    }
  }

  const isValueFormatIncorrect = (value: string | null) => {
    return value && value.length > 0 && !isValid(getValidDate(value!))
  }

  return (
    <>
      <Wrapper className="date-picker">
        {label && (
          <label className="iu-mr-300" htmlFor={id}>
            {label}
          </label>
        )}
        <TextInput
          disabled={disabled}
          id={id}
          name={textInputName}
          type="text"
          maxLength={10}
          className="ic-textfield"
          onChange={handleTextInputOnChange}
          onBlur={handleTextInputOnBlur}
          onKeyDown={textInputOnKeyDown}
          placeholder="åååå-mm-dd"
          value={inputString ?? ''}
          ref={textInputRef}
          data-testid={textInputDataTestId}
          displayValidationError={displayValidationErrorOutline}
        />
        <DatePicker
          disabled={disabled}
          shouldCloseOnSelect={true}
          onChange={() => {
            /*Empty*/
          }}
          dateFormat={_format}
          customInput={
            <StyledButton
              displayValidationError={displayValidationErrorOutline}
              onClick={() => setOpen(true)}
              className="ic-button"
              onClickCapture={() => setOpen(true)}>
              <FontAwesomeIcon icon={faCalendarWeek} size="lg" />
            </StyledButton>
          }
          onClickOutside={() => setOpen(false)}
          open={open}
          selected={date}
          onSelect={(date: any, event: any) => {
            setOpen(false)
            handleDateOnSelect(date)
          }}
          showWeekNumbers
        />
      </Wrapper>

      {displayFormattingError && (
        <ValidationWrapper>
          <QuestionValidationTexts validationErrors={InvalidDateFormatValidationMessage}></QuestionValidationTexts>
        </ValidationWrapper>
      )}
    </>
  )
}

export default DatePickerCustom
