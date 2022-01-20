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
import { updateClientValidationError } from '../../../../store/certificate/certificateActions'
import { useDispatch, useSelector } from 'react-redux'
import { getVisibleValidationErrors } from '../../../../store/certificate/certificateSelectors'

const regexArray = [dayCodeReg, weekCodeReg, monthCodeReg]

const INVALID_DATE_PERIOD_ERROR = 'Ange ett slutdatum som infaller efter startdatumet.'
const NOT_COMPLETE_DATE_ERROR_MESSAGE = 'Ange ett datum.'

interface Props {
  label: string
  periodId: string
  fromDate: string | null
  toDate: string | null
  updateValue: (valueId: string, fromDate: string | null, toDate: string | null) => void
  getPeriodStartingDate: () => string
  hasValidationError: boolean
  disabled: boolean
  baseWorkHours: string
  questionId: string
}

const DateRangePicker: React.FC<Props> = ({
  label,
  periodId,
  fromDate,
  toDate,
  updateValue,
  getPeriodStartingDate,
  hasValidationError,
  disabled,
  baseWorkHours,
  questionId,
}) => {
  const [dateChecked, setDateChecked] = useState(!!fromDate || !!toDate)
  const [fromDateInput, setFromDateInput] = useState<string | null>(fromDate)
  const [toDateInput, setToDateInput] = useState<string | null>(toDate)
  const fromTextInputRef = useRef<null | HTMLInputElement>(null)
  const tomTextInputRef = useRef<null | HTMLInputElement>(null)
  const [workHoursPerWeek, setWorkHoursPerWeek] = useState<null | number>(null)
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState<null | number>(null)
  const previousFromDateString = usePrevious(fromDateInput)
  const previousToDateString = usePrevious(toDateInput)
  const dispatch = useDispatch()
  const validationErrors = useSelector(getVisibleValidationErrors(questionId, periodId))

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
    const invalidDatePeriod = fromDate && toDate && isBefore(getValidDate(toDate)!, getValidDate(fromDate)!)
    const notCompleteDatePeriod = (fromDate && !toDate) || (toDate && !fromDate)

    dispatch(
      updateClientValidationError({
        shouldBeRemoved: !invalidDatePeriod,
        validationError: {
          category: '',
          field: 'row.' + periodId,
          id: questionId,
          text: INVALID_DATE_PERIOD_ERROR,
          type: 'INVALID_DATE_PERIOD',
          showAlways: true,
        },
      })
    )

    let notCompleteDateField = ''
    if (!notCompleteDatePeriod) {
      notCompleteDateField = periodId
    } else {
      notCompleteDateField = !toDateInput ? 'tom.' + periodId : 'from.' + periodId
    }
    dispatch(
      updateClientValidationError({
        shouldBeRemoved: !notCompleteDatePeriod,
        validationError: {
          category: '',
          field: notCompleteDateField,
          id: questionId,
          text: NOT_COMPLETE_DATE_ERROR_MESSAGE,
          type: 'NOT_COMPLETE_DATE',
        },
      })
    )
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
  }

  const getShouldDisplayValidationErrorOutline = (id: string, field: string) => {
    if (hasValidationError) {
      return true
    }
    if (id) {
      return validationErrors.filter((v: ValidationError) => v.field.includes(field + '.' + id) || v.field.includes('row.' + id)).length > 0
    }
    return validationErrors.length > 0
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
              displayValidationErrorOutline={getShouldDisplayValidationErrorOutline(periodId, 'from')}
              componentField={'from.' + periodId}
              questionId={questionId}
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
              displayValidationErrorOutline={getShouldDisplayValidationErrorOutline(periodId, 'tom')}
              componentField={'tom.' + periodId}
              questionId={questionId}
            />
          </DatesWrapper>
        </DateGrid>
      </DateRangeWrapper>
      <div className={'iu-pb-300'}>
        <QuestionValidationTexts validationErrors={validationErrors} />
      </div>
      {workHoursPerWeek !== null && workDaysPerWeek && (
        <p className="iu-color-main">
          Arbetstid: {workHoursPerWeek} timmar/vecka {workDaysPerWeek && workDaysPerWeek > 0 && <span>i {workDaysPerWeek} dagar.</span>}
        </p>
      )}
    </>
  )
}

export default DateRangePicker
