import React, { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { isValid, parse } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarWeek } from '@fortawesome/free-solid-svg-icons'
import { formatDateToString, getValidDate, QuestionValidationTexts, _dateReg, _dateRegDashesOptional, _format } from '@frontend/common'
import { DatePickerWrapper, StyledButton, TextInput, ValidationWrapper, Wrapper } from './Styles'

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
  additionalStyles?: string
}

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
  additionalStyles,
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
    <Wrapper>
      <DatePickerWrapper className={`date-picker + ${additionalStyles}`}>
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
          className={` ic-textfield ${displayValidationErrorOutline || displayFormattingError ? 'ic-textfield--error' : ''}`}
          onChange={handleTextInputOnChange}
          onBlur={handleTextInputOnBlur}
          onKeyDown={textInputOnKeyDown}
          placeholder="åååå-mm-dd"
          value={inputString ?? ''}
          ref={textInputRef}
          data-testid={textInputDataTestId}
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
              displayValidationError={displayValidationErrorOutline || displayFormattingError}
              onClick={() => setOpen(true)}
              className={`ic-button `}
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
      </DatePickerWrapper>

      {displayFormattingError && (
        <ValidationWrapper>
          <QuestionValidationTexts validationErrors={InvalidDateFormatValidationMessage}></QuestionValidationTexts>
        </ValidationWrapper>
      )}
    </Wrapper>
  )
}

export default DatePickerCustom
