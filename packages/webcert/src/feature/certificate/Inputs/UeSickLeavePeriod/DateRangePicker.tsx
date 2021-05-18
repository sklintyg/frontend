import React, { useEffect, useRef, useState } from 'react'
import DatePickerCustom from '../DatePickerCustom'
import { parse, addDays, differenceInCalendarDays, isEqual, isValid, isBefore } from 'date-fns'
import ReactDatePicker from 'react-datepicker'
import colors from '../../../../components/styles/colors'
import { updateCertificateDataElement } from '../../../../store/certificate/certificateActions'
// import { useSelector, useDispatch } from 'react-redux'
import {
  CertificateDataElement,
  ConfigUeCheckboxDateRange,
  QuestionValidationTexts,
  ValidationError,
  ValueDateRange,
  ValueDateRangeList,
} from '@frontend/common'
import _, { update } from 'lodash'
import styled, { css } from 'styled-components/macro'
import { Checkbox, getValidDate, formatDateToString, parseDayCodes } from '@frontend/common'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { checkBoxStyles, DateRangeWrapper, DatesWrapper } from './Styles'

const _dateReg = /[1-2][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/
const _dateRegDashesOptional = /[1-2][0-9]{3}-?(0[1-9]|1[0-2])-?(0[1-9]|[1-2][0-9]|3[0-1])/

const dayCodeReg = /^(?=\d*d\d*$)d?(?!0+d?$)(\d{1,3})d?$/i
const weekCodeReg = /^(?=\d*v\d*$)v?(?!0+v?$)(\d{1,3})v?$/i
const monthCodeReg = /^(?=\d*m\d*$)m?(?!0+m?$)(\d{1,2})m?$/i

const regexArray = [dayCodeReg, weekCodeReg, monthCodeReg]

const INVALID_DATE_FORMAT_ERROR = 'Ange datum i formatet åååå-mm-dd.'
const INVALID_DATE_PERIOD_ERROR = 'Ange ett slutdatum som infaller efter startdatumet.'

interface Props {
  label: string
  periodId: string
  fromDate: string | null
  toDate: string | null
  updateValue: (valueId: string, fromDate: string | null, toDate: string | null) => void
  getPeriodStartingDate: (periodId: string) => string
}

interface Validation {
  from: {
    invalidFormat: boolean
  }
  to: {
    invalidFormat: boolean
  }
  invalidDatePeriod: boolean
  validationErrors: ValidationError[]
}

const DateRangePicker: React.FC<Props> = ({ label, periodId, fromDate, toDate, updateValue, getPeriodStartingDate }) => {
  const [dateChecked, setDateChecked] = useState(!!fromDate || !!toDate)
  const [fromDateString, setFromDateString] = useState<string | null>(fromDate)
  const [toDateString, setToDateString] = useState<string | null>(toDate)
  const fromTextInputRef = useRef<null | HTMLInputElement>(null)
  const tomTextInputRef = useRef<null | HTMLInputElement>(null)
  const [validations, setValidation] = useState<Validation>({
    from: { invalidFormat: false },
    to: { invalidFormat: false },
    invalidDatePeriod: false,
    validationErrors: [],
  })

  function usePrevious(value: any) {
    const ref = React.useRef(value)

    React.useEffect(() => {
      ref.current = value
    })

    return ref.current
  }

  const previousFromDateString = usePrevious(fromDateString)
  const previousToDateString = usePrevious(toDateString)

  useEffect(() => {
    const updateCheckbox = () => {
      if (fromDateString || toDateString) {
        setDateChecked(true)
      } else {
        setDateChecked(false)
      }
    }

    if (previousFromDateString !== fromDateString || previousToDateString !== toDateString) {
      updateCheckbox()
      updateValue(periodId, fromDateString, toDateString)
    }
  }, [toDateString, fromDateString, previousFromDateString, previousToDateString])

  useEffect(() => {
    toggleShowValidationError(fromDate, toDate)
  }, [])

  // useEffect(() => {}, [validations.from.invalidFormat, validations.to.invalidFormat, validations.invalidDatePeriod])

  const handleFromTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setFromDateString(value ?? null)

    if (!value) {
      return
    }

    const updatedFromDate = getValidDate(value)

    if (isValid(updatedFromDate)) {
      const dateString = formatDateToString(updatedFromDate!)
      setFromDateString(dateString)
    }
  }

  const handleDatePickerSelectFrom = (date: Date) => {
    const fromDateString = formatDateToString(date)
    setFromDateString(fromDateString)
    toggleShowValidationError(fromDateString, toDateString)
    tomTextInputRef.current?.focus()
  }

  const handleDatePickerSelectTo = (date: Date) => {
    const toDateString = formatDateToString(date)
    setToDateString(toDateString)

    toggleShowValidationError(fromDateString, toDateString)
  }

  const handleToTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setToDateString(value)
  }

  const handleFromTextInputOnBlur = () => {
    toggleShowValidationError(fromDateString, toDateString)
  }

  const handleToTextInputOnBlur = () => {
    formatToInputTextField()
    const parsedToDate = getParsedToDateString(fromDateString, toDateString)
    toggleShowValidationError(fromDateString, parsedToDate ?? toDateString)
  }

  const handleFromTextInputOnKeyDown = (event: React.KeyboardEvent) => {
    if (event.key.toLowerCase() === 'enter') {
      fromTextInputRef.current?.blur()
      tomTextInputRef.current?.focus()
    }
  }

  const handleToTextInputOnKeyDown = (event: React.KeyboardEvent) => {
    if (event.key.toLowerCase() === 'enter') {
      tomTextInputRef.current?.blur()
    }
  }

  const toggleShowValidationError = (fromDate: string | null, toDate: string | null) => {
    const updatedValidationErrors = { ...validations }

    if (fromDate && fromDate.length > 0 && !isValid(getValidDate(fromDate!))) {
      updatedValidationErrors.from.invalidFormat = true
    } else {
      updatedValidationErrors.from.invalidFormat = false
    }

    if (toDate && toDate.length > 0 && !isValid(getValidDate(toDate!))) {
      updatedValidationErrors.to.invalidFormat = true
    } else {
      updatedValidationErrors.to.invalidFormat = false
    }

    if (fromDate && toDate && isBefore(getValidDate(toDate)!, getValidDate(fromDate)!)) {
      updatedValidationErrors.invalidDatePeriod = true
    } else {
      updatedValidationErrors.invalidDatePeriod = false
    }

    setValidation(updatedValidationErrors)
    updateValidationMessages(updatedValidationErrors)
  }

  const updateValidationMessages = (validations: Validation) => {
    let updatedValidationErrorList: ValidationError[] = []

    if (!validations.from.invalidFormat && !validations.to.invalidFormat && !validations.invalidDatePeriod) {
      resetValidation()
      return
    }

    if (validations.from.invalidFormat || validations.to.invalidFormat) {
      // if (!updatedValidationErrorList.some((val) => val.text === INVALID_DATE_FORMAT_ERROR)) {
      updatedValidationErrorList = [
        ...updatedValidationErrorList,
        { category: '', field: '', id: '', text: INVALID_DATE_FORMAT_ERROR, type: '' },
      ]
      // }
    }

    if (validations.invalidDatePeriod) {
      // if (!updatedValidationErrorList.some((val) => val.text === INVALID_DATE_PERIOD_ERROR)) {
      updatedValidationErrorList = [
        ...updatedValidationErrorList,
        { category: '', field: '', id: '', text: INVALID_DATE_PERIOD_ERROR, type: '' },
      ]
      // }
    }

    setValidation({ ...validations, validationErrors: updatedValidationErrorList })
  }

  const getParsedToDateString = (fromDateString: string | null, toDateString: string | null) => {
    if (!toDateString || !fromDateString || !getValidDate(fromDateString)) {
      return
    }
    const fromDate = getValidDate(fromDateString)!

    const inputMatchesRegex = regexArray.some((reg) => reg.test(toDateString))

    if (inputMatchesRegex && fromDate) {
      const numberOfDaysToAdd = parseDayCodes(toDateString)

      if (numberOfDaysToAdd) {
        //Befintliga webcert drar bort en dag i beräkningen
        const newDate = addDays(fromDate, numberOfDaysToAdd - 1)
        return formatDateToString(newDate)
      }
    } else if (_dateReg.test(toDateString) || _dateRegDashesOptional.test(toDateString)) {
      const newDate = getValidDate(toDateString)

      if (newDate) {
        return formatDateToString(newDate)
      }
    } else return null
  }

  const formatToInputTextField = () => {
    if (!toDateString || !fromDateString || !getValidDate(fromDateString)) {
      return
    }

    const fromDate = getValidDate(fromDateString)!

    const inputMatchesRegex = regexArray.some((reg) => reg.test(toDateString))

    if (inputMatchesRegex && fromDate) {
      const numberOfDaysToAdd = parseDayCodes(toDateString)

      if (numberOfDaysToAdd) {
        //Befintliga webcert drar bort en dag i beräkningen
        const newDate = addDays(fromDate, numberOfDaysToAdd - 1)
        setToDateString(formatDateToString(newDate))
      }
    } else if (_dateReg.test(toDateString) || _dateRegDashesOptional.test(toDateString)) {
      const newDate = getValidDate(toDateString)

      if (newDate) {
        setToDateString(formatDateToString(newDate))
      }
    }
  }

  const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      tomTextInputRef.current?.focus()
      const fromDate = getPeriodStartingDate(periodId)
      setFromDateString(fromDate)
    } else {
      reset()
    }
  }

  const reset = () => {
    setFromDateString(null)
    setToDateString(null)
    resetValidation()
  }

  const resetValidation = () => {
    setValidation({ from: { invalidFormat: false }, to: { invalidFormat: false }, invalidDatePeriod: false, validationErrors: [] })
  }

  return (
    <>
      <DateRangeWrapper>
        <Checkbox
          id={`${periodId}-checkbox`}
          hasValidationError={false}
          disabled={false}
          value={'test'}
          wrapperStyles={checkBoxStyles}
          checked={dateChecked}
          onChange={handleCheckboxClick}
          label={label}
        />
        <DatesWrapper id="fromWrapper">
          <label htmlFor={`from${periodId}`}>Fr.o.m</label>
          <DatePickerCustom
            id={`from${periodId}`}
            textInputRef={fromTextInputRef}
            textInputOnBlur={handleFromTextInputOnBlur}
            textInputOnKeyDown={handleFromTextInputOnKeyDown}
            textInputName={`from${periodId}`}
            inputString={fromDateString}
            setDate={handleDatePickerSelectFrom}
            textInputOnChange={handleFromTextInputChange}
            textInputDataTestId={`from${periodId}`}
            displayValidationError={validations.invalidDatePeriod || validations.from.invalidFormat}
          />
        </DatesWrapper>
        <DatesWrapper>
          <label htmlFor={`tom${periodId}`}>t.o.m</label>
          <DatePickerCustom
            id={`tom${periodId}`}
            textInputName={`tom${periodId}`}
            textInputRef={tomTextInputRef}
            inputString={toDateString}
            setDate={handleDatePickerSelectTo}
            textInputOnChange={handleToTextInputChange}
            textInputOnBlur={handleToTextInputOnBlur}
            textInputOnKeyDown={handleToTextInputOnKeyDown}
            textInputDataTestId={`tom${periodId}`}
            displayValidationError={validations.invalidDatePeriod || validations.to.invalidFormat}
          />
        </DatesWrapper>
      </DateRangeWrapper>
      {<QuestionValidationTexts validationErrors={validations.validationErrors}></QuestionValidationTexts>}
    </>
  )
}

export default DateRangePicker
