import { formatDateToString, getValidDate, _format } from '@frontend/common'
import classNames from 'classnames'
import { isValid, parse } from 'date-fns'
import sv from 'date-fns/locale/sv'
import React, { useContext, useState, useCallback } from 'react'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styled, { CSSProp } from 'styled-components'
import calendar from '../../../images/calendar.svg'
import { DatePickerBoundryContext } from './DatePickerBoundryContext'
import { DatePickerWrapper, FocusWrapper, StyledButton, TextInput, Wrapper } from './Styles'
import { _maxAllowedDate, _minAllowedDate, _yearFormat } from '../../..'

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
  forbidFutureDates?: boolean
  max?: string
  min?: string
  vertical?: boolean
  inputCss?: CSSProp | undefined
  yearOnly?: boolean
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
  forbidFutureDates,
  max,
  min,
  vertical,
  inputCss,
  yearOnly,
}) => {
  const [open, setOpen] = useState(false)
  const boundryRef = useContext(DatePickerBoundryContext)

  const getValidDateForPicker = (dateString: string | null) => {
    if (dateString) {
      const date = parse(dateString, _format, new Date())

      if (isValid(date)) {
        return date
      }
    }

    return new Date()
  }

  const getMaxDate = () => {
    if (forbidFutureDates) {
      return new Date()
    } else if (max) {
      return new Date(getFullDate(max) as string)
    } else return _maxAllowedDate
  }

  const getFullDate = useCallback(
    (value: string | null) => {
      return value && `${value}${yearOnly ? '-01-02' : ''}`
    },
    [yearOnly]
  )

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
            onChange={(event) => {
              const value = event.target.value
              const parsedDate = getValidDate(value)
              const isValueValid = isValid(parsedDate)

              if (parsedDate && isValueValid) {
                textInputOnChange(formatDateToString(parsedDate), isValueValid)
              } else {
                textInputOnChange(value, isValueValid)
              }
            }}
            onBlur={textInputOnBlur}
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
            dateFormat={yearOnly ? _yearFormat : _format}
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
            selected={getValidDateForPicker(getFullDate(inputString))}
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
            minDate={min ? new Date(getFullDate(min) as string) : _minAllowedDate}
          />
        </FocusWrapper>
      </DatePickerWrapper>
    </Wrapper>
  )
}

export default DatePickerCustom
