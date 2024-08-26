import classNames from 'classnames'
// eslint-disable-next-line import/no-duplicates
import { isValid, parse } from 'date-fns'
// eslint-disable-next-line import/no-duplicates
import sv from 'date-fns/locale/sv'
import type React from 'react'
import { useCallback, useContext, useState } from 'react'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import type { CSSProp } from 'styled-components'
import styled from 'styled-components'
import calendar from '../../../images/calendar.svg'
import { _format, _maxAllowedDate, _minAllowedDate, _yearFormat, formatDateToString, getValidDate } from '../../../utils'
import { DatePickerBoundryContext } from './DatePickerBoundryContext'

const Logo = styled.img`
  width: 20px;
  height: 20px;
`

const DatePickerWrapper = styled.div<{
  vertical?: boolean
}>`
  display: ${(props) => (props.vertical === true ? 'block' : 'flex')};
  align-items: center;
  position: relative;
`
const PickerWrapper = styled.div`
  position: absolute;
  right: 0px;
`
const StyledButton = styled.button<{
  displayValidationError: boolean
}>`
  min-width: 0;
  padding: 0 !important;
  width: 55px;
  height: 3rem;
  box-shadow: none;
  background-color: ${(props) => (props.displayValidationError ? '#fbf2f4' : '#f7f4f2')};
  color: #000000;

  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top: ${(props) => (props.displayValidationError ? '1px solid rgb(193, 33, 67)' : '1px solid rgb(141, 141, 141)')};
  border-right: ${(props) => (props.displayValidationError ? '1px solid rgb(193, 33, 67)' : '1px solid rgb(141, 141, 141)')};
  border-bottom: ${(props) => (props.displayValidationError ? '2px solid rgb(193, 33, 67)' : '0.125rem solid #01a5a3')};

  &:hover {
    background-color: ${(props) => (props.displayValidationError ? '#fbf2f4' : '#f7f4f2')};
    color: #000000;
  }
  &:focus {
    border-top-left-radius: 0.1875rem;
  }
`

const TextInput = styled.input`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: 0 !important;
  min-width: 124px;
  min-height: unset !important;
  width: 100%;
  &:focus {
    border-top-left-radius: 0.1875rem;
    border-top-right-radius: 0.1875rem;
  }
`

export const ValidationWrapper = styled.div`
  flex-basis: 100%;
`

const Wrapper = styled.div`
  display: inline-block;
`
const FocusWrapper = styled.div`
  display: flex;
  height: 3rem;
`
registerLocale('sv', sv)
setDefaultLocale('sv')

interface Props {
  disabled?: boolean
  label?: string
  setDate: (date: string) => void
  inputString: string | null
  textInputOnChange: (value: string, isValueValid?: boolean) => void
  textInputOnBlur?: React.FocusEventHandler<HTMLInputElement>
  textInputOnKeyDown?: (event: React.KeyboardEvent) => void
  id?: string
  textInputName?: string
  textInputRef?: ((instance: HTMLInputElement | null) => void) | React.RefObject<HTMLInputElement> | null
  textInputDataTestId?: string
  displayValidationErrorOutline: boolean
  additionalStyles?: string
  max?: string
  min?: string
  vertical?: boolean
  inputCss?: CSSProp
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
          <PickerWrapper>
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
                  onClickCapture={() => setOpen(!open)}
                >
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
              weekLabel="v."
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
                      // eslint-disable-next-line no-param-reassign
                      state.elements.popper.dataset.popperReferenceHidden = ''
                    } else {
                      // eslint-disable-next-line no-param-reassign
                      delete state.elements.popper.dataset.popperReferenceHidden
                    }
                    return state
                  },
                },
              ]}
              maxDate={max ? new Date(getFullDate(max) as string) : _maxAllowedDate}
              minDate={min ? new Date(getFullDate(min) as string) : _minAllowedDate}
            />
          </PickerWrapper>
        </FocusWrapper>
      </DatePickerWrapper>
    </Wrapper>
  )
}

export default DatePickerCustom
