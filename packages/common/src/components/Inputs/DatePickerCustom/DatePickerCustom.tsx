import React, { useEffect, useState } from 'react'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import sv from 'date-fns/locale/sv'
import { isValid, parse } from 'date-fns'
import { _dateReg, _format, formatDateToString, getValidDate } from '@frontend/common'
import { DatePickerWrapper, StyledButton, TextInput, Wrapper, FocusWrapper } from './Styles'
import 'react-datepicker/dist/react-datepicker.css'
import { ValidationError } from '../../..'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'

registerLocale('sv', sv)
setDefaultLocale('sv')

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
  displayValidationErrorOutline: boolean
  additionalStyles?: string
  componentField: string
  questionId: string
  onDispatchValidationError: (shouldBeRemoved: boolean, validationError: ValidationError) => void
}

const INVALID_DATE_FORMAT_ERROR = 'Ange datum i formatet åååå-mm-dd.'

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
  componentField,
  questionId,
  onDispatchValidationError,
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
    toggleFormattingError()
  }, [displayFormattingError])

  const toggleFormattingError = () => {
    onDispatchValidationError(!displayFormattingError, {
      category: '',
      field: componentField,
      id: questionId,
      text: INVALID_DATE_FORMAT_ERROR,
      type: 'INVALID_DATE_FORMAT',
      showAlways: true,
    })
  }

  useEffect(() => {
    if (displayFormattingError) {
      updateFormattingValidation(inputString)
    }
  }, [inputString])

  const getValidDateForPicker = (dateString: string) => {
    if (_dateReg.test(dateString)) {
      dateString = dateString.replace(/-/g, '')
    }

    const date = parse(dateString, 'yyyyMMdd', new Date())

    if (isValid(date)) return date

    return new Date()
  }

  if (inputString) {
    date = getValidDateForPicker(inputString)
  } else {
    date = new Date()
  }

  const handleTextInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value

    const parsedDate = getValidDate(value)

    if (isValid(parsedDate)) {
      value = formatDateToString(parsedDate!)
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
        <FocusWrapper>
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
            calendarStartDay={1}
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
                className={`ic-button `}
                onClickCapture={() => setOpen(!open)}>
                <FontAwesomeIcon icon={faCalendar} />{' '}
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
            popperPlacement="bottom-end"
          />
        </FocusWrapper>
      </DatePickerWrapper>
    </Wrapper>
  )
}

export default DatePickerCustom
