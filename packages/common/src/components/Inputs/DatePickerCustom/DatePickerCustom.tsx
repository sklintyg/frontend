import { formatDateToString, getValidDateFormat, getValidDate, _dateReg, _format } from '@frontend/common'
import classNames from 'classnames'
import { isValid, parse } from 'date-fns'
import sv from 'date-fns/locale/sv'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styled from 'styled-components'
import { ValidationError } from '../../..'
import calendar from '../../../images/calendar.svg'
import { DatePickerBoundryContext } from './DatePickerBoundryContext'
import { DatePickerWrapper, FocusWrapper, StyledButton, TextInput, Wrapper } from './Styles'

const Logo = styled.img`
  width: 20px;
  height: 20px;
`

registerLocale('sv', sv)
setDefaultLocale('sv')

export interface Props {
  disabled?: boolean
  label?: string
  setDate: (date: string) => void
  inputString: string | null
  textInputOnChange: (value: string, isValueValid?: boolean) => void
  textInputOnBlur?: React.FocusEventHandler<HTMLInputElement>
  textInputOnKeyDown?: (event: React.KeyboardEvent) => void
  id?: string
  textInputName?: string
  textInputRef?: ((instance: HTMLInputElement | null) => void) | React.RefObject<HTMLInputElement> | null | undefined
  textInputDataTestId?: string
  displayValidationErrorOutline: boolean
  additionalStyles?: string
  componentField?: string
  questionId?: string
  onDispatchValidationError?: (shouldBeRemoved: boolean, validationError: ValidationError) => void
  forbidFutureDates?: boolean
  max?: string
  min?: string
}

const INVALID_DATE_FORMAT_ERROR = 'Ange datum i formatet åååå-mm-dd.'

const UNREASONABLE_DATE = 'Ange ett datum som inte ligger för långt fram eller tillbaka i tiden.'

const isValueFormatIncorrect = (value: string | null) => {
  return value && value.length > 0 && !isValid(getValidDateFormat(value))
}

const isValueUnreasonable = (value: string | null) => {
  return value && value.length > 0 && !isValid(getValidDate(value))
}

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
  forbidFutureDates,
  max,
  min,
}) => {
  const [open, setOpen] = useState(false)
  const [displayFormattingError, setDisplayFormattingError] = useState(false)
  const [displayUnreasonableDateError, setDisplayUnreasonableDateError] = useState(false)
  const toggleFormattingError = useCallback(() => {
    if (onDispatchValidationError) {
      onDispatchValidationError(!displayFormattingError, {
        category: '',
        field: componentField ? componentField : '',
        id: questionId ? questionId : '',
        text: INVALID_DATE_FORMAT_ERROR,
        type: 'INVALID_DATE_FORMAT',
        showAlways: true,
      })
    }
  }, [displayFormattingError, onDispatchValidationError, componentField, questionId])

  const toggleUnreasonableDateError = useCallback(() => {
    if (onDispatchValidationError) {
      onDispatchValidationError(!displayUnreasonableDateError, {
        category: '',
        field: componentField ? componentField : '',
        id: questionId ? questionId : '',
        text: UNREASONABLE_DATE,
        type: 'UNREASONABLE_DATE',
        showAlways: true,
      })
    }
  }, [displayUnreasonableDateError, onDispatchValidationError, componentField, questionId])

  const boundryRef = useContext(DatePickerBoundryContext)

  const getValidDateForPicker = (dateString: string) => {
    if (_dateReg.test(dateString)) {
      dateString = dateString.replace(/-/g, '')
    }

    const date = parse(dateString, 'yyyyMMdd', new Date())

    if (isValid(date)) return date

    return new Date()
  }

  let date: Date

  useEffect(() => {
    toggleFormattingError()
  }, [displayFormattingError, toggleFormattingError])

  useEffect(() => {
    toggleUnreasonableDateError()
  }, [displayUnreasonableDateError, toggleUnreasonableDateError])

  useEffect(() => {
    if (displayFormattingError || displayUnreasonableDateError) {
      updateFormattingValidation(inputString)
    }
  }, [inputString, displayFormattingError])

  if (inputString) {
    date = getValidDateForPicker(inputString)
  } else {
    date = new Date()
  }

  const handleTextInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value

    const parsedDate = getValidDate(value)
    const isValueValid = isValid(parsedDate)

    if (parsedDate && isValueValid) {
      value = formatDateToString(parsedDate)
    }

    textInputOnChange(value, isValueValid)
  }

  const handleTextInputOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    updateFormattingValidation(inputString)
    textInputOnBlur?.(event)
  }

  const updateFormattingValidation = (value: string | null) => {
    setDisplayUnreasonableDateError(false)
    if (isValueFormatIncorrect(value)) {
      setDisplayFormattingError(true)
    } else {
      setDisplayFormattingError(false)
      updateUnreasonableValidation(value)
    }
  }
  const updateUnreasonableValidation = (value: string | null) => {
    if (isValueUnreasonable(value)) {
      setDisplayUnreasonableDateError(true)
    } else {
      setDisplayUnreasonableDateError(false)
    }
  }

  const getMaxDate = () => {
    if (forbidFutureDates) {
      return new Date()
    } else if (max) {
      return new Date(max)
    } else return undefined
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
            className={classNames('ic-textfield', { 'ic-textfield--error error': displayValidationErrorOutline })}
            onChange={handleTextInputOnChange}
            onBlur={handleTextInputOnBlur}
            onKeyDown={textInputOnKeyDown}
            placeholder="åååå-mm-dd"
            value={inputString ?? ''}
            ref={textInputRef}
            data-testid={textInputDataTestId}
            autoComplete="off"
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
                aria-label="Öppna kalendern"
                displayValidationError={displayValidationErrorOutline}
                onClick={() => setOpen(true)}
                className={classNames('ic-button', { error: displayValidationErrorOutline })}
                onClickCapture={() => setOpen(!open)}>
                <Logo src={calendar} alt="Kalender" />
              </StyledButton>
            }
            onClickOutside={() => setOpen(false)}
            open={open}
            selected={date}
            onSelect={(date: Date) => {
              setOpen(false)
              setDate(formatDateToString(date))
            }}
            showWeekNumbers
            portalId="root"
            popperPlacement="bottom-end"
            popperModifiers={[
              {
                name: 'preventOverflow',
                options: {
                  rootBoundary: 'viewport',
                  boundary: boundryRef?.current ?? 'clippingParents',
                  tether: false,
                  altAxis: true,
                },
              },
              {
                name: 'updateReferenceHiddenAttribute',
                enabled: true,
                phase: 'main',
                requiresIfExists: ['offset'],
                fn({ state }) {
                  const isReferenceHidden = state.attributes.popper['data-popper-reference-hidden']
                  if (typeof isReferenceHidden !== 'string' && isReferenceHidden) {
                    state.elements.popper.dataset.popperReferenceHidden = ''
                  } else {
                    delete state.elements.popper.dataset.popperReferenceHidden
                  }
                  return state
                },
              },
            ]}
            maxDate={getMaxDate()}
            minDate={min ? new Date(min) : undefined}
          />
        </FocusWrapper>
      </DatePickerWrapper>
    </Wrapper>
  )
}

export default DatePickerCustom
