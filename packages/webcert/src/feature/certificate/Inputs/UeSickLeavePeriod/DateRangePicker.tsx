import React, { useEffect, useRef, useState } from 'react'
import { addDays, isBefore, isValid } from 'date-fns'
import {
  _dateReg,
  _dateRegDashesOptional,
  Checkbox,
  dayCodeReg,
  formatDateToString,
  getPeriodWorkDays,
  getPeriodWorkHours,
  getValidDate,
  isDateRangeValid,
  monthCodeReg,
  parseDayCodes,
  QuestionValidationTexts,
  ValidationError,
  weekCodeReg,
} from '@frontend/common'
import { DateGrid, DateRangeWrapper, DatesWrapper } from './Styles'
import usePrevious from '../../../../hooks/usePrevious'
import { DatePickerCustom } from '@frontend/common/src'

const regexArray = [dayCodeReg, weekCodeReg, monthCodeReg]

const INVALID_DATE_PERIOD_ERROR = 'Ange ett slutdatum som infaller efter startdatumet.'

interface Props {
  label: string
  periodId: string
  fromDate: string | null
  toDate: string | null
  updateValue: (valueId: string, fromDate: string | null, toDate: string | null) => void
  getPeriodStartingDate: () => string
  hasOverlap: boolean
  hasValidationError: boolean
  disabled: boolean
  baseWorkHours: string
}

interface DateRangeValidation {
  invalidDatePeriod: boolean
  validationErrors: ValidationError[]
}

const DateRangePicker: React.FC<Props> = ({
  label,
  periodId,
  fromDate,
  toDate,
  updateValue,
  getPeriodStartingDate,
  hasOverlap,
  hasValidationError,
  disabled,
  baseWorkHours,
}) => {
  const [dateChecked, setDateChecked] = useState(!!fromDate || !!toDate)
  const [fromDateInput, setFromDateInput] = useState<string | null>(fromDate)
  const [toDateInput, setToDateInput] = useState<string | null>(toDate)
  const fromTextInputRef = useRef<null | HTMLInputElement>(null)
  const tomTextInputRef = useRef<null | HTMLInputElement>(null)
  const [validations, setValidation] = useState<DateRangeValidation>({
    invalidDatePeriod: false,
    validationErrors: [],
  })
  const [workHoursPerWeek, setWorkHoursPerWeek] = useState<null | number>(null)
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState<null | number>(null)

  const previousFromDateString = usePrevious(fromDateInput)
  const previousToDateString = usePrevious(toDateInput)

  useEffect(() => {
    if (previousFromDateString !== fromDateInput || previousToDateString !== toDateInput) {
      updateCheckbox(fromDateInput, toDateInput)

      if (isDateRangeValid(fromDateInput!, toDateInput!)) {
        updateValue(periodId, fromDateInput, toDateInput)
        updateWorkingPeriod(fromDateInput, toDateInput)
      } else if (shouldClearPreviousPeriod(fromDateInput!, toDateInput!, previousFromDateString, previousToDateString)) {
        updateValue(periodId, null, null)
      }
    }
  }, [toDateInput, fromDateInput, previousFromDateString, previousToDateString])

  useEffect(() => {
    updateWorkingPeriod(fromDateInput, toDateInput)
  }, [baseWorkHours])

  useEffect(() => {
    toggleShowValidationError(fromDate, toDate)
  }, [])

  const updateCheckbox = (fromDateInput: string | null, toDateInput: string | null) => {
    if (fromDateInput || toDateInput) {
      setDateChecked(true)
    } else {
      setDateChecked(false)
    }
  }

  const shouldClearPreviousPeriod = (updatedFrom: string, updatedTo: string, previousFrom: string, previousTo: string): boolean => {
    return !isDateRangeValid(updatedFrom, updatedTo) && isDateRangeValid(previousFrom, previousTo)
  }

  const updateWorkingPeriod = (fromDateString: string | null, toDateString: string | null) => {
    if (!baseWorkHours || baseWorkHours === '0' || baseWorkHours === '') {
      setWorkHoursPerWeek(null)
      setWorkDaysPerWeek(null)
      return
    }

    if (!fromDateString || !toDateString || !parseInt(baseWorkHours)) return

    const fromDate = getValidDate(fromDateString)
    const toDate = getValidDate(toDateString)

    if (fromDate && toDate) {
      const workingHoursPerWeek = getPeriodWorkHours(parseInt(baseWorkHours), periodId)
      const periodWorkDays = getPeriodWorkDays(fromDate, toDate)

      setWorkHoursPerWeek(workingHoursPerWeek)
      setWorkDaysPerWeek(periodWorkDays)
    }
  }

  const handleFromTextInputChange = (value: string) => {
    setFromDateInput(value ?? null)
  }

  const handleDatePickerSelectFrom = (date: string) => {
    setFromDateInput(date)
    toggleShowValidationError(date, toDateInput)
    tomTextInputRef.current?.focus()
  }

  const handleDatePickerSelectTo = (date: string) => {
    setToDateInput(date)
    toggleShowValidationError(fromDateInput, date)
  }

  const handleToTextInputChange = (value: string) => {
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

    if (fromDate && toDate && isBefore(getValidDate(toDate)!, getValidDate(fromDate)!)) {
      updatedValidationErrors.invalidDatePeriod = true
    } else {
      updatedValidationErrors.invalidDatePeriod = false
    }

    setValidation(updatedValidationErrors)
    updateValidationMessages(updatedValidationErrors)
  }

  const updateValidationMessages = (validations: DateRangeValidation) => {
    let updatedValidationErrorList: ValidationError[] = []

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

      if (newDate && isValid(newDate)) {
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

      if (newDate && isValid(newDate)) {
        setToDateInput(formatDateToString(newDate))
      }
    }
  }

  const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      tomTextInputRef.current?.focus()
      const fromDate = getPeriodStartingDate()
      setFromDateInput(fromDate)
    } else {
      reset()
    }
  }

  const reset = () => {
    setFromDateInput(null)
    setToDateInput(null)
    setWorkHoursPerWeek(null)
    setWorkDaysPerWeek(null)
    resetValidation()
  }

  const resetValidation = () => {
    setValidation({
      invalidDatePeriod: false,
      validationErrors: [],
    })
  }

  const getShouldDisplayValidationErrorOutline = () => {
    return validations.invalidDatePeriod || hasOverlap || hasValidationError
  }

  return (
    <>
      <DateRangeWrapper className="iu-mb-400">
        <Checkbox
          id={`${periodId}-checkbox`}
          hasValidationError={hasValidationError}
          checked={dateChecked}
          onChange={handleCheckboxClick}
          label={label}
          disabled={disabled}
        />
        <DateGrid>
          <DatesWrapper id="fromWrapper">
            <DatePickerCustom
              disabled={disabled}
              label={'Fr.o.m'}
              id={`from${periodId}`}
              textInputRef={fromTextInputRef}
              textInputOnBlur={handleFromTextInputOnBlur}
              textInputOnKeyDown={handleFromTextInputOnKeyDown}
              textInputName={`from${periodId}`}
              inputString={fromDateInput}
              setDate={handleDatePickerSelectFrom}
              textInputOnChange={handleFromTextInputChange}
              textInputDataTestId={`from${periodId}`}
              displayValidationErrorOutline={getShouldDisplayValidationErrorOutline()}
            />
          </DatesWrapper>
          <DatesWrapper>
            <DatePickerCustom
              disabled={disabled}
              label={'t.o.m'}
              id={`tom${periodId}`}
              textInputName={`tom${periodId}`}
              textInputRef={tomTextInputRef}
              inputString={toDateInput}
              setDate={handleDatePickerSelectTo}
              textInputOnChange={handleToTextInputChange}
              textInputOnBlur={handleToTextInputOnBlur}
              textInputOnKeyDown={handleToTextInputOnKeyDown}
              textInputDataTestId={`tom${periodId}`}
              displayValidationErrorOutline={getShouldDisplayValidationErrorOutline()}
            />
          </DatesWrapper>
        </DateGrid>
      </DateRangeWrapper>
      {!disabled && (
        <div className={'iu-mb-400'}>
          <QuestionValidationTexts validationErrors={validations.validationErrors} />
        </div>
      )}
      {workHoursPerWeek !== null && workDaysPerWeek && (
        <p className="iu-color-main">
          Arbetstid: {workHoursPerWeek} timmar/vecka {workDaysPerWeek && workDaysPerWeek > 0 && <span>i {workDaysPerWeek} dagar.</span>}
        </p>
      )}
    </>
  )
}

export default DateRangePicker
