import React, { useEffect, useRef, useState } from 'react'
import DatePickerCustom from '../DatePickerCustom'
import { addDays, isValid, isBefore } from 'date-fns'
import { QuestionValidationTexts, ValidationError } from '@frontend/common'
import _ from 'lodash'
import { Checkbox, getValidDate, formatDateToString, parseDayCodes } from '@frontend/common'
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
  getHasOverlap: (date: string | null, periodId: string) => boolean
}

interface DateRangeValidation {
  from: {
    invalidFormat: boolean
    overlap: boolean
  }
  to: {
    invalidFormat: boolean
    overlap: boolean
  }
  invalidDatePeriod: boolean
  validationErrors: ValidationError[]
}

const DateRangePicker: React.FC<Props> = ({ label, periodId, fromDate, toDate, updateValue, getPeriodStartingDate, getHasOverlap }) => {
  const [dateChecked, setDateChecked] = useState(!!fromDate || !!toDate)
  const [fromDateInput, setFromDateInput] = useState<string | null>(fromDate)
  const [toDateInput, setToDateInput] = useState<string | null>(toDate)
  const fromTextInputRef = useRef<null | HTMLInputElement>(null)
  const tomTextInputRef = useRef<null | HTMLInputElement>(null)
  const [validations, setValidation] = useState<DateRangeValidation>({
    from: { invalidFormat: false, overlap: false },
    to: { invalidFormat: false, overlap: false },
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

  const previousFromDateString = usePrevious(fromDateInput)
  const previousToDateString = usePrevious(toDateInput)

  useEffect(() => {
    const updateCheckbox = () => {
      if (fromDateInput || toDateInput) {
        setDateChecked(true)
      } else {
        setDateChecked(false)
      }
    }

    if (previousFromDateString !== fromDateInput || previousToDateString !== toDateInput) {
      updateCheckbox()
      updateValue(periodId, fromDateInput, toDateInput)
    }
  }, [toDateInput, fromDateInput, previousFromDateString, previousToDateString])

  useEffect(() => {
    toggleShowValidationError(fromDate, toDate)
  }, [])

  const handleFromTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setFromDateInput(value ?? null)

    if (!value) {
      return
    }

    const updatedFromDate = getValidDate(value)

    if (isValid(updatedFromDate)) {
      const dateString = formatDateToString(updatedFromDate!)
      setFromDateInput(dateString)
    }
  }

  const handleDatePickerSelectFrom = (date: Date) => {
    const fromDateString = formatDateToString(date)
    setFromDateInput(fromDateString)
    toggleShowValidationError(fromDateString, toDateInput)
    tomTextInputRef.current?.focus()
  }

  const handleDatePickerSelectTo = (date: Date) => {
    const toDateString = formatDateToString(date)
    setToDateInput(toDateString)

    toggleShowValidationError(fromDateInput, toDateString)
  }

  const handleToTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setToDateInput(value)
  }

  const handleFromTextInputOnBlur = () => {
    toggleShowValidationError(fromDateInput, toDateInput)
  }

  const handleToTextInputOnBlur = () => {
    formatToInputTextField()
    const parsedToDate = getParsedToDateString(fromDateInput, toDateInput)
    toggleShowValidationError(fromDateInput, parsedToDate ?? toDateInput)
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

    const fromDateOverlap = getHasOverlap(fromDate!, periodId)

    setValidation(updatedValidationErrors)
    updateValidationMessages(updatedValidationErrors)
  }

  const updateValidationMessages = (validations: DateRangeValidation) => {
    let updatedValidationErrorList: ValidationError[] = []

    if (!validations.from.invalidFormat && !validations.to.invalidFormat && !validations.invalidDatePeriod) {
      resetValidation()
      return
    }

    if (validations.from.invalidFormat || validations.to.invalidFormat) {
      updatedValidationErrorList = [
        ...updatedValidationErrorList,
        { category: '', field: '', id: '', text: INVALID_DATE_FORMAT_ERROR, type: '' },
      ]
    }

    if (validations.invalidDatePeriod) {
      updatedValidationErrorList = [
        ...updatedValidationErrorList,
        { category: '', field: '', id: '', text: INVALID_DATE_PERIOD_ERROR, type: '' },
      ]
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
    if (!toDateInput || !fromDateInput || !getValidDate(fromDateInput)) {
      return
    }

    const fromDate = getValidDate(fromDateInput)!

    const inputMatchesRegex = regexArray.some((reg) => reg.test(toDateInput))

    if (inputMatchesRegex && fromDate) {
      const numberOfDaysToAdd = parseDayCodes(toDateInput)

      if (numberOfDaysToAdd) {
        //Befintliga webcert drar bort en dag i beräkningen
        const newDate = addDays(fromDate, numberOfDaysToAdd - 1)
        setToDateInput(formatDateToString(newDate))
      }
    } else if (_dateReg.test(toDateInput) || _dateRegDashesOptional.test(toDateInput)) {
      const newDate = getValidDate(toDateInput)

      if (newDate) {
        setToDateInput(formatDateToString(newDate))
      }
    }
  }

  const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      tomTextInputRef.current?.focus()
      const fromDate = getPeriodStartingDate(periodId)
      setFromDateInput(fromDate)
    } else {
      reset()
    }
  }

  const reset = () => {
    setFromDateInput(null)
    setToDateInput(null)
    resetValidation()
  }

  const resetValidation = () => {
    setValidation({
      from: { invalidFormat: false, overlap: false },
      to: { invalidFormat: false, overlap: false },
      invalidDatePeriod: false,
      validationErrors: [],
    })
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
            inputString={fromDateInput}
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
            inputString={toDateInput}
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
