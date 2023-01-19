import { formatDateToString, getValidDate, getValidDateFormat, _dateReg, _format } from '@frontend/common'
import classNames from 'classnames'
import { isValid, parse } from 'date-fns'
import sv from 'date-fns/locale/sv'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styled, { CSSProp } from 'styled-components'
import { ValidationError, _yearFormat } from '../../..'
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
  vertical?: boolean
  inputCss?: CSSProp | undefined
  yearOnly?: boolean
}

const INVALID_DATE_FORMAT_ERROR = 'Ange datum i formatet åååå-mm-dd.'

const INVALID_YEAR_FORMAT_ERROR = 'Ange år i formatet åååå.'

const UNREASONABLE_DATE = 'Ange ett datum som inte ligger för långt fram eller tillbaka i tiden.'

const UNREASONABLE_YEAR = 'Ange ett år som inte ligger för långt fram eller tillbaka i tiden.'

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
  vertical,
  inputCss,
  yearOnly,
}) => {
  const [open, setOpen] = useState(false)
  const [displayFormattingError, setDisplayFormattingError] = useState(false)
  const [displayUnreasonableDateError, setDisplayUnreasonableDateError] = useState(false)

  const getFullDate = useCallback(
    (value: string | null) => {
      return value && `${value}${yearOnly ? '-01-01' : ''}`
    },
    [yearOnly]
  )

  const toggleFormattingError = useCallback(() => {
    if (onDispatchValidationError) {
      onDispatchValidationError(!displayFormattingError, {
        category: '',
        field: componentField ? componentField : '',
        id: questionId ? questionId : '',
        text: yearOnly ? INVALID_YEAR_FORMAT_ERROR : INVALID_DATE_FORMAT_ERROR,
        type: 'INVALID_DATE_FORMAT',
        showAlways: true,
      })
    }
  }, [displayFormattingError, onDispatchValidationError, componentField, questionId, yearOnly])

  const toggleUnreasonableDateError = useCallback(() => {
    if (onDispatchValidationError) {
      onDispatchValidationError(!displayUnreasonableDateError, {
        category: '',
        field: componentField ? componentField : '',
        id: questionId ? questionId : '',
        text: yearOnly ? UNREASONABLE_YEAR : UNREASONABLE_DATE,
        type: 'UNREASONABLE_DATE',
        showAlways: true,
      })
    }
  }, [displayUnreasonableDateError, onDispatchValidationError, componentField, questionId, yearOnly])

  const updateFormattingValidation = useCallback(
    (value: string | null) => {
      setDisplayUnreasonableDateError(false)
      if (isValueFormatIncorrect(getFullDate(value))) {
        setDisplayFormattingError(true)
      } else {
        setDisplayFormattingError(false)
        updateUnreasonableValidation(getFullDate(value))
      }
    },
    [getFullDate]
  )

  const updateUnreasonableValidation = (value: string | null) => {
    if (isValueUnreasonable(value)) {
      setDisplayUnreasonableDateError(true)
    } else {
      setDisplayUnreasonableDateError(false)
    }
  }

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
  }, [inputString, displayFormattingError, displayUnreasonableDateError, updateFormattingValidation])

  if (inputString) {
    date = getValidDateForPicker(getFullDate(inputString) as string)
  } else {
    date = new Date()
  }

  const handleTextInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = getFullDate(event.target.value) ?? ''

    const parsedDate = getValidDate(value)
    const isValueValid = isValid(parsedDate)

    if (parsedDate && isValueValid) {
      value = formatDateToString(parsedDate)
    }

    textInputOnChange(value, isValueValid)
  }

  const handleTextInputOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    updateFormattingValidation(getFullDate(inputString))
    textInputOnBlur?.(event)
  }

  const getMaxDate = () => {
    if (forbidFutureDates) {
      return new Date()
    } else if (max) {
      return new Date(getFullDate(max) as string)
    } else return undefined
  }

  return (
    <Wrapper>
      <DatePickerWrapper className={`date-picker + ${additionalStyles}`} vertical={vertical}>
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
            maxLength={yearOnly ? 4 : 10}
            className={classNames('ic-textfield', { 'ic-textfield--error error': displayValidationErrorOutline })}
            onChange={handleTextInputOnChange}
            onBlur={handleTextInputOnBlur}
            onKeyDown={textInputOnKeyDown}
            placeholder={yearOnly ? 'åååå' : 'åååå-mm-dd'}
            value={inputString ?? ''}
            ref={textInputRef}
            data-testid={textInputDataTestId}
            autoComplete="off"
            css={inputCss}
          />
          <DatePicker
            calendarStartDay={1}
            disabled={disabled}
            shouldCloseOnSelect={true}
            onChange={() => {
              /*Empty*/
            }}
            dateFormat={yearOnly === true ? _yearFormat : _format}
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
            showYearPicker={yearOnly}
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
            minDate={min ? new Date(getFullDate(min) as string) : undefined}
          />
        </FocusWrapper>
      </DatePickerWrapper>
    </Wrapper>
  )
}

export default DatePickerCustom
